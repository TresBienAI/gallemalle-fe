import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">갈래말래</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:border-black transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:border-black transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-black">About</a></li>
                            <li><a href="#" className="hover:text-black">Careers</a></li>
                            <li><a href="#" className="hover:text-black">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-black">App</a></li>
                            <li><a href="#" className="hover:text-black">Partnerships</a></li>
                            <li><a href="#" className="hover:text-black">Agency</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-black">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} 트레비앙. All rights reserved.</p>
                    <p>Made with ❤️ in Seoul</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
