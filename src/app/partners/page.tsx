export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Our Partners</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-600 text-center mb-12">
          We work with trusted partners to provide the best delivery services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Logistics Partners</h3>
            <p className="text-gray-600">
              Nationwide delivery network ensuring fast and reliable service.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Technology Partners</h3>
            <p className="text-gray-600">
              Advanced tracking and management systems for better service.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Payment Partners</h3>
            <p className="text-gray-600">
              Secure and convenient payment options for all customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
