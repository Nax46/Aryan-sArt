import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud } from "lucide-react";

const CustomOrderForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    location: '',
    size: '',
    material: '',
    imageBase64: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image must be under 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/custom-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.contact,
          email: formData.email,
          location: formData.location,
          size: formData.size,
          material: formData.material,
          imageBase64: formData.imageBase64
        })
      });

      if (response.ok) {
        toast({ title: "Success!", description: "Your custom order request has been submitted. We will contact you soon." });
        setFormData({ name: '', contact: '', email: '', location: '', size: '', material: '', imageBase64: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not submit your request. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-order" className="py-16 sm:py-24 px-4 bg-sand/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-display font-light text-foreground mb-4">
            Request Custom Design
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Looking for something specific? Fill out the form below with your requirements and reference photos. We specialize in CNC and Laser-cut temples and customized interiors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-10 rounded-sm border border-border shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="Sunil Jangid" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <input required type="tel" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="hello@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="City, State" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Desired Size</label>
              <input required type="text" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="e.g. 4x4 feet" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Material / Finish</label>
              <input required type="text" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full px-4 py-2 border border-border rounded-sm bg-transparent focus:ring-1 focus:ring-primary" placeholder="e.g. Teak Wood / Corian" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Reference Photo</label>
            <div className="border-2 border-dashed border-border rounded-sm p-8 text-center hover:bg-muted/50 transition-colors">
              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {formData.imageBase64 ? "Image Selected - Click to change" : "Click to upload an image"}
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG, up to 5MB</span>
              </label>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Custom Request"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CustomOrderForm;
