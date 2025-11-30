import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

export function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'test@tresvien.com' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/');
            window.location.reload(); // Force reload to update Header
        } else {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.\n(ID: test@tresvien.com / PW: 1234)');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">로그인</h2>
                        <p className="mt-2 text-sm text-gray-400">
                            계정이 없으신가요?{' '}
                            <a href="#" className="font-medium text-white hover:underline">
                                회원가입
                            </a>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    이메일 주소
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative block w-full rounded-md border-0 bg-white/5 py-3 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                                    placeholder="이메일 주소"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative block w-full rounded-md border-0 bg-white/5 py-3 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                                    placeholder="비밀번호"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-white"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                    로그인 유지
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-gray-400 hover:text-white">
                                    비밀번호 찾기
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-semibold text-black hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                로그인
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-black px-2 text-gray-400">또는</span>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="button"
                                className="group relative flex w-full justify-center items-center gap-2 rounded-md bg-[#FEE500] px-3 py-3 text-sm font-semibold text-black hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
                            >
                                <MessageCircle className="h-5 w-5 fill-black" />
                                카카오로 시작하기
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
