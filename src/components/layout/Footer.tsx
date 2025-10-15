import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="text-xl font-bold">LocalMarket</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Conectando productores locales con tu comunidad. 
              Productos frescos, sostenibles y de proximidad directamente a tu mesa.
            </p>
            <p className="text-sm text-gray-400">
              © 2025 LocalMarket. Todos los derechos reservados.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-green-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/productores" className="text-gray-300 hover:text-green-400 transition-colors">
                  Productores
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-300 hover:text-green-400 transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-gray-300 hover:text-green-400 transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-green-400 transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-300 hover:text-green-400 transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/vendedor" className="text-gray-300 hover:text-green-400 transition-colors">
                  Vende con nosotros
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            LocalMarket - Mercado local digital
          </p>
          <div className="flex space-x-4">
            <span className="text-gray-400 text-sm">Síguenos:</span>
            <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              Facebook
            </Link>
            <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              Instagram
            </Link>
            <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}