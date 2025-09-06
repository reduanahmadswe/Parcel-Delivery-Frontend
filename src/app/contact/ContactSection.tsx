export default function ContactSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-gray-600 text-center mb-8">
          Get in touch with us for any questions about our parcel delivery
          services.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>contact@parceltrack.com</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>+880-1234-567890</p>
          </div>
          <div>
            <h3 className="font-semibold">Address</h3>
            <p>123 Main Street, Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
