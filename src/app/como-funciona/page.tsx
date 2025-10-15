export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cómo funciona LocalMarket
          </h1>
          <p className="text-xl text-gray-600">
            Conectamos productores locales con consumidores en 3 sencillos pasos
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Explora productos locales
              </h3>
              <p className="text-gray-600 text-lg">
                Navega por nuestra selección de productos frescos, artesanales y sostenibles 
                de productores verificados de tu región. Utiliza nuestros filtros para encontrar 
                exactamente lo que buscas.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-green-500 h-64 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🛒 Explorar productos</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Agrega al carrito y compra
              </h3>
              <p className="text-gray-600 text-lg">
                Selecciona los productos que desees, agrégalos a tu carrito y procede 
                al checkout. Puedes elegir entre recogida en punto local o entrega a domicilio.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-green-500 h-64 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💳 Comprar fácil</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Recibe productos frescos
              </h3>
              <p className="text-gray-600 text-lg">
                Recibe tus productos directamente del productor, frescos y con toda la trazabilidad. 
                Después puedes dejar tu valoración para ayudar a otros consumidores.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-green-500 h-64 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📦 Recibir productos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Beneficios para todos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Para consumidores
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Productos frescos y de calidad</li>
                <li>• Conoces el origen de tus alimentos</li>
                <li>• Apoyas la economía local</li>
                <li>• Reduces la huella de carbono</li>
                <li>• Precios justos y transparentes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Para productores
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Acceso directo a consumidores</li>
                <li>• Mejor margen de beneficio</li>
                <li>• Herramientas digitales de venta</li>
                <li>• Comunidad de apoyo</li>
                <li>• Gestión simplificada de pedidos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}