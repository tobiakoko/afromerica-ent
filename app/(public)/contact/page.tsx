import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@afromerica.com",
    href: "mailto:hello@afromerica.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 XXX XXX XXXX",
    href: "tel:+234XXXXXXXXX"
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Lagos, Nigeria",
    href: null
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Get in Touch"
        description="We'd love to hear from you"
        badge="Contact Us"
      />

      <section className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            {contactInfo.map((info) => {
              const Icon = info.icon;
              const content = (
                <Card className="p-6 flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{info.label}</p>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </Card>
              );

              return info.href ? (
                <a key={info.label} href={info.href} className="block hover:scale-105 transition-transform">
                  {content}
                </a>
              ) : (
                <div key={info.label}>{content}</div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}