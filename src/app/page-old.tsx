import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import { ChevronRightIcon, ShieldCheckIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline'

// Mock data for demonstration
const featuredProducts = [
  {
    id: '1',
    name: 'Tomates cherry orgánicos',
    description: 'Tomates cherry cultivados de forma orgánica, perfectos para ensaladas',
    price: 4.50,
    category: 'Verduras',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer1',
    stock: 25,
    rating_avg: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Queso artesanal de cabra',
    description: 'Queso cremoso de cabra elaborado artesanalmente en nuestra granja',
    price: 12.90,
    category: 'Lácteos',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer2',
    stock: 8,
    rating_avg: 4.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Miel de acacia pura',
    description: 'Miel 100% natural de flores de acacia, extraída sin aditivos',
    price: 8.75,
    category: 'Endulzantes',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer3',
    stock: 15,
    rating_avg: 4.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Conectando productores locales con tu comunidad
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Descubre productos frescos, sostenibles y de proximidad directamente 
                de agricultores y artesanos locales. Apoya tu comunidad mientras 
                disfrutas de la mejor calidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/productos"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Explorar productos
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/como-funciona"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
                >
                  Cómo funciona
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-green-500 rounded-lg shadow-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    🌱 LocalMarket 🥕
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir LocalMarket?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conectamos directamente a productores locales con consumidores conscientes, 
              creando una comunidad más sostenible y saludable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Productos verificados
              </h3>
              <p className="text-gray-600">
                Todos nuestros productores son verificados para garantizar 
                la calidad y autenticidad de sus productos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Entrega rápida
              </h3>
              <p className="text-gray-600">
                Recibe tus productos frescos directamente del productor 
                en tiempo récord o recógelos en puntos locales.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comunidad local
              </h3>
              <p className="text-gray-600">
                Apoya a los productores de tu región y fortalece 
                la economía local mientras cuidas el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos destacados
              </h2>
              <p className="text-gray-600">
                Descubre los productos más populares de nuestra comunidad
              </p>
            </div>
            <Link
              href="/productos"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Ver todos
              <ChevronRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Productores locales</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-green-100">Productos disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Clientes satisfechos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Eres productor local?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y lleva tus productos directamente 
            a miles de consumidores que valoran lo local y sostenible.
          </p>
          <Link
            href="/vendedor"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
          >
            Vende con nosotros
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="./vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="./file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="./window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="./globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
