import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    IconUserCircle,
    IconUser,
    IconLock
} from '@tabler/icons-react';

import { useMediaQuery } from "@/comps/public/useMediaQuery"
import RegistrationProgressBar from "@/comps/auth/register/progressBar"
import SubjectCheckboxToggle from '@/comps/auth/register/subjectToggle';

import { getRole } from "@/utils/api/roleData"
import { getSubject } from "@/utils/api/subject"

interface Subject {
    subject_id: string;
    subject_name: string;
    show: any;
}

interface SelectedSubject {
    subject_id: string;
    subject_name: string;
    show: any
}


const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [pageRegis, setPageRegis] = useState<number>(0)
    const router = useRouter();

    const [userType, setUserType] = useState('');

    const handleSubmit = () => {
        // Add authentication logic here
        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
        } else {
            setError('');
            // ส่งข้อมูลต่อไป...
            console.log('Password OK:', password);
        }

        if (pageRegis === 2) {
            console.log('Login attempt:', { email, password });
            // Redirect after successful login
            // router.push('/dashboard');
        }
    };
    const [optionsRole, setOptionsRole] = useState([]);
    const [optionsSubject, setOptionsSubject] = useState([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);

    useEffect(() => {
        // สมมติว่า getRole() รับ role_id และส่งกลับข้อมูล

        const fetchRoles = async () => {
            const roles = await getRole({ show: true })

            console.log("roles", roles.data)
            // แปลงข้อมูลเป็นรูปแบบที่ต้องการ
            const formattedOptionsRole = roles['data'].map(role => ({
                value: role.role_id,
                label: role.role_name
            }));
            setOptionsRole(formattedOptionsRole);
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subject = await getSubject({ show: true });
                console.log("subject", subject.data);
                setSubjects(subject.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
            }
        };

        fetchSubjects();
    }, []);

    const handleSelectionChange = (newSelectedSubjects: SelectedSubject[]) => {
        setSelectedSubjects(newSelectedSubjects);
        console.log("Selected subjects:", newSelectedSubjects);
        
        // You can use selectedSubjects here or in another function
        // e.g., for form submission
      };

    const isLargerThanSm = useMediaQuery("(min-width: 821px)");

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 relative overflow-hidden h-full items-center">

            {/* Right side wavy pattern */}
            {isLargerThanSm ? (
                <>
                    <div className={`absolute right-0 h-[120%] w-[100%] opacity-95 z-0 -top-48`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(30%)'
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className={`w-full h-[130%] rotate-3`} />

                    </div>

                    <div className={`absolute -right-20 h-[120%] w-[100%] opacity-55 z-0 top-32`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(30%)'
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className='w-full h-[130%] ' />

                    </div>

                    <div className={`absolute -right-10 h-[120%] w-[100%] opacity-35 z-0 top-0`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(30%)'
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className='w-full h-[130%] ' />

                    </div>
                </>
            ) : (
                <>
                    <div className={`absolute right-0 h-[110%] w-[200%] opacity-95 z-0 top-0`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(20%)',
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className={`w-[120%] h-[120%] rotate-90`} />

                    </div>

                    <div className={`absolute right-0 h-[110%] w-[150%] opacity-55 z-0 top-0`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(-10%)'
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className='w-[120%] h-[100%] rotate-90' />

                    </div>

                    <div className={`absolute right-0 h-[110%] w-[160%] opacity-35 z-0 top-0`}
                        style={{
                            // borderRadius: '50% 0 0 50% / 100% 0 0 100%',
                            transform: 'translateX(30%)'
                        }} >
                        <Image src={"/clevDT.png"} alt={"clev"} width={1000} height={1000} className='w-[120%] h-[100%] rotate-90' />

                    </div>
                </>
            )}


            <div className={`
                flex flex-col justify-center w-full z-10 h-[90%]
                ${isLargerThanSm ? 'items-end' : 'items-center'}
            `}>
                <div className={`
                    flex flex-col w-full max-w-xl p-8 rounded-lg h-full justify-between
                    ${isLargerThanSm ? 'mr-[18%]' : 'mr-0'}
                `}>
                    <h1 className="text-2xl font-bold text-center mb-8 text-[#000000]">Register</h1>

                    <form className='h-[70%]'>
                        {pageRegis === 0 ? (
                            <>
                                {/* email */}
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUser size={20} className="text-teal-500" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* firstname */}
                                <div className="mb-4">
                                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                                        Firstname
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUser size={20} className="text-teal-500" />
                                        </div>
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="firstname"
                                            placeholder="ชื่อจริง"
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                            className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* lastname */}
                                <div className="mb-4">
                                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                        Lastname
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUser size={20} className="text-teal-500" />
                                        </div>
                                        <input
                                            id="lastname"
                                            name="lastname"
                                            type="lastname"
                                            placeholder="นามสกุล"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* password */}
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <IconLock size={20} className="text-teal-500" />
                                            </div>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconLock size={20} className="text-teal-500" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 block w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            </>
                        ) : pageRegis === 1 ? (
                            <>
                                <div className="text-black">
                                    <p className="mb-2">คุณสมัครใช้งาน bukatsu ในฐานะ:</p>
                                    <div className="flex flex-wrap gap-4 ml-5">
                                        {optionsRole.map((option) => (
                                            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="userType"
                                                    value={option.value}
                                                    checked={userType === option.value}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                    className="form-radio text-blue-500"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <SubjectCheckboxToggle
                                    subjects={subjects}
                                    onSelectionChange={handleSelectionChange}
                                />

                                {/* {selectedSubjects.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium mb-2">Selected Subjects ({selectedSubjects.length})</h3>
                                        <ul className="list-disc pl-5">
                                            {selectedSubjects.map(subject => (
                                                <li key={subject.subject_id}>{subject.subject_name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )} */}
                            </>
                        )}

                    </form>

                    {pageRegis === 2 ? (

                        <div>
                            <RegistrationProgressBar currentPage={pageRegis} />

                            <div className="flex w-full justify-between">
                                <button
                                    className="w-[48%] bg-gray-300 hover:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => setPageRegis(pageRegis - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    type="submit"
                                    className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Register
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-gray-600">Do you have account already?</span>{' '}
                                <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
                                    Login
                                </Link>
                            </div>
                        </div>

                    ) : pageRegis === 0 ? (
                        <div>
                            <RegistrationProgressBar currentPage={pageRegis} />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => setPageRegis(pageRegis + 1)}
                            >
                                Continue
                            </button>
                            <div className="mt-4 text-center">
                                <span className="text-gray-600">Do you have account already?</span>{' '}
                                <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
                                    Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <RegistrationProgressBar currentPage={pageRegis} />
                            <div className="flex w-full justify-between">
                                <button
                                    className="w-[48%] bg-gray-300 hover:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => setPageRegis(pageRegis - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => setPageRegis(pageRegis + 1)}
                                >
                                    Continue
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-gray-600">Do you have account already?</span>{' '}
                                <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;