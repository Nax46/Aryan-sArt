import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { sendCustomOrderAlertToAdmin, sendCustomOrderConfirmationEmail } from '../lib/resend';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, location, size, material, imageBase64 } = req.body;
    
    let reference_image_url = null;
    
    if (imageBase64) {
      // Decode base64 
      const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${crypto.randomBytes(16).toString('hex')}.${type.split('/')[1] || 'png'}`;
        
        const { data, error } = await supabase
          .storage
          .from('custom_orders')
          .upload(filename, buffer, {
            contentType: type,
          });
          
        if (error) {
           console.error("Storage upload error:", error);
        } else {
           const { data: publicUrlData } = supabase.storage.from('custom_orders').getPublicUrl(filename);
           reference_image_url = publicUrlData.publicUrl;
        }
      }
    }
    
    // Create description string mapping to db columns
    const description = `Location: ${location}. Material: ${material}. Size: ${size}`;
    
    const { data: order, error } = await supabase
      .from('custom_orders')
      .insert([{
        name,
        phone,
        email,
        description,
        dimensions: size,
        reference_image_url,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;

    // Send emails
    try {
      await sendCustomOrderAlertToAdmin(name, phone, email, description, size);
      if (email) {
        await sendCustomOrderConfirmationEmail(name, email);
      }
    } catch (err) {
      console.error('Email sending failed for custom order:', err);
    }

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    console.error("Custom order error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
