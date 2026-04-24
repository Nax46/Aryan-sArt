import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { CreateOrderBody } from '../types';
import { sendOrderConfirmationEmail, sendNewOrderAlertToAdmin } from '../lib/resend';

const router = Router();

router.post('/', async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
  try {
    const { customer, items, paymentMethod, shippingAddress, notes } = req.body;
    
    // 1. Upsert customer
    let customerId = customer.id;
    if (!customerId) {
      if (!customer.email && !customer.phone) {
        res.status(400).json({ error: 'Customer email or phone required' });
        return;
      }
      
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .or(`email.eq.${customer.email},phone.eq.${customer.phone}`)
        .single();
        
      if (existing) {
        customerId = existing.id;
        await supabase.from('customers').update(customer).eq('id', customerId);
      } else {
        const { data: newCustomer, error: custError } = await supabase
          .from('customers')
          .insert([customer])
          .select('id')
          .single();
          
        if (custError) throw custError;
        customerId = newCustomer.id;
      }
    }

    // 2. Calculate total
    const total_amount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const initialStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';

    // 3. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customerId,
        total_amount,
        status: initialStatus,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        shipping_address: shippingAddress,
        notes
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Send Emails if COD
    if (paymentMethod === 'cod') {
      const itemsCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      try {
        await sendOrderConfirmationEmail(order.id, itemsCount, total_amount);
        await sendNewOrderAlertToAdmin(
          order.id,
          total_amount,
          customer.name || 'Customer',
          customer.phone || 'N/A',
          itemsCount,
          shippingAddress,
          paymentMethod
        );
      } catch (err) {
        console.error('Email sending failed:', err);
      }
    }

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*)), customers(*)')
      .eq('id', req.params.id)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/track/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, tracking_number, shiprocket_order_id, created_at')
      .eq('id', req.params.id)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
