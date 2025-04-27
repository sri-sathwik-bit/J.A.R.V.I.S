export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">J.A.R.V.I.S.</h3>
            <p className="text-sm text-gray-400">
              Just A Rather Very Intelligent System - Advanced AI assistant for comprehensive task management.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Voice Control</li>
              <li>OS Management</li>
              <li>Task Automation</li>
              <li>Data Analysis</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Community</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@jarvis-ai.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Tech Plaza, San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} J.A.R.V.I.S. AI System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
