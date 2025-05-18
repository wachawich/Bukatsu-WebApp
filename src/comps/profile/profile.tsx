import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { User, Lock, Mail, Phone, Save, Upload, Eye, EyeOff, Pencil } from 'lucide-react';
import { getUser, updateUser, changePassword } from "@/utils/api/userData"

import { decodeToken } from "@/utils/auth/jwt";

import { useNotification } from "@/comps/noti/notiComp"

import { sendOTP, verifyOTP } from '@/utils/auth/authAPI';

// Define user interface based on the provided fields
interface UserProfile {
  user_sys_id: string;
  username: string;
  email: string;
  password?: string;
  profile_image?: string;
  user_first_name: string;
  user_last_name: string;
  phone: string;
}

// Function to generate default avatar if no profile image exists
function generateDefaultAvatar(letter: string) {
  const svg = `
  <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0EA5E9" />
        <stop offset="50%" stop-color="#2563EB" />
        <stop offset="100%" stop-color="#1E40AF" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#avatarGradient)" />
    <text 
      x="50%" 
      y="50%" 
      font-size="64" 
      fill="white" 
      dominant-baseline="middle" 
      text-anchor="middle" 
      font-family="Arial, sans-serif"
      font-weight="bold">
      ${letter}
    </text>
  </svg>
  `;

  // For client-side usage
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Server-side fallback
  return '';
}

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [showVerifyFields, setShowVerifyFields] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [initialProfile, setInitialProfile] = useState<UserProfile>({});

  const { showNotification } = useNotification();

  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    user_sys_id: '',
    username: '',
    email: '',
    user_first_name: '',
    user_last_name: '',
    phone: '',
    profile_image: ''
  });

  // Password change states
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditing, setIsEditing] = useState(false);

  // File upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = decodeToken();

        if (token.length === 0) {
          console.log("token not found!")
          return
        }

        const data = await getUser({ user_sys_id: token.user_sys_id });
        console.log("data", data.data[0])

        setProfile(data.data[0]);
        setInitialProfile(data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(initialProfile);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Upload image if selected
      let updatedProfileImage = profile.profile_image;

      if (selectedImage) {
        // In a real app, you would upload the image to a server and get the URL
        // For now, just use the preview URL
        updatedProfileImage = previewImage || '';
      }

      // Prepare updated profile data
      const updatedProfile = {
        ...profile,
        profile_image: updatedProfileImage
      };

      // Call the updateUser API function
      const response = await updateUser({
        user_sys_id: parseInt(profile.user_sys_id),
        username: updatedProfile.username,
        email: updatedProfile.email,
        user_first_name: updatedProfile.user_first_name,
        user_last_name: updatedProfile.user_last_name,
        phone: updatedProfile.phone,
      });

      console.log("response", response)

      console.log("updatedProfile", updatedProfile)

      setProfile(updatedProfile);
      //setMessage({ type: 'success', text: 'Profile updated successfully!' });
      showNotification("Success", "Profile updated successfully!", "success");

      // Clear preview after successful upload
      setPreviewImage(null);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      //setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      showNotification("Error", "Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { currentPassword, newPassword, confirmPassword } = passwordData;

      // Validate passwords
      if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification("Error", "All password fields are required", "error");

        return;
      }

      if (newPassword !== confirmPassword) {
        showNotification("Error", "New passwords do not match", "error");

        return;
      }

      if (newPassword.length < 8) {
        showNotification("Error", "Password must be at least 8 characters long", "error");

        return;
      }

      // Call the changePassword API function
      const response = await changePassword({
        user_sys_id: profile.user_sys_id,
        old_password: currentPassword,
        new_password: newPassword
      });

      if (response.success) {
        showNotification("Success", "Password changed successfully!", "success");

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setShowPasswordFields(false);
      } else {
        showNotification("Error", `${response.message}`, "error");
      }
      // Reset password fields


      // Hide password change form
      setShowPasswordFields(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // const handleSendOtp = async () => {
  //   if (!verifyEmail.endsWith("@kmutt.ac.th")) {
  //     showNotification("Invalid Email", "กรุณาใช้อีเมลที่ลงท้ายด้วย @kmutt.ac.th", "error");
  //     return;
  //   }

  //   setSending(true);
  //   try {
  //     const res = await sendOTP({ email: verifyEmail });
  //     if (res.success) {
  //       showNotification("OTP Sent", res.message, "success");
  //       setOtpSent(true);
  //     } else {
  //       showNotification("Send OTP Failed", res.message, "error");
  //     }
  //   } catch (error) {
  //     showNotification("Error", "เกิดข้อผิดพลาดในการส่ง OTP", "error");
  //   } finally {
  //     setSending(false);
  //   }
  // };

  // const handleVerifySubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setVerifying(true);
  //   try {
  //     const res = await verifyOTP({ email: verifyEmail, otp });
  //     if (res.success) {
  //       showNotification("Verified", res.message, "success");
  //       //handleVerify(); // <-- เรียกฟังก์ชันหลังยืนยันสำเร็จ
  //     } else {
  //       showNotification("Verification Failed", res.message, "error");
  //     }
  //   } catch (error) {
  //     showNotification("Error", "เกิดข้อผิดพลาดในการยืนยัน OTP", "error");
  //   } finally {
  //     setVerifying(false);
  //   }
  // };


  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta name="description" content="Manage your user profile" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Image Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-4">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-blue-100"
                />
              ) : profile.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt={`${profile.user_first_name} ${profile.user_last_name}`}
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={generateDefaultAvatar(profile.user_first_name?.[0] || 'U')}
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

            </div>
            <h2 className="text-xl font-semibold text-gray-800">{profile.user_first_name} {profile.user_last_name}</h2>
            <p className="text-gray-600">@{profile.username}</p>
          </div>

          {/* Profile Information Form */}
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="user_first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="user_first_name"
                    name="user_first_name"
                    value={profile.user_first_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="user_last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="user_last_name"
                    name="user_last_name"
                    value={profile.user_last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={true}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isEditing && (
                <button
                  type="submit"
                  disabled={saving || !isEditing}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              )}
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Pencil size={16} className="mr-2" />
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setProfile(initialProfile);
                    // อาจจะ reset ข้อมูลกลับไปเป็น profile เดิมถ้ามี
                  }}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Verify */}
          {/* <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">KMUTT Verification</h2>

            {!showVerifyFields ? (
              <button
                type="button"
                onClick={() => setShowVerifyFields(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload size={18} className="mr-2" />
                Verify KMUTT
              </button>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">KMUTT Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="yourname@kmutt.ac.th"
                      required
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sending}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          Send OTP
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={verifying}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {verifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          Verify OTP
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowVerifyFields(false);
                      setVerifyEmail('');
                      setOtp('');
                      setOtpSent(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div> */}

          {/* Password Change Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>

            {!showPasswordFields ? (
              <button
                type="button"
                onClick={() => setShowPasswordFields(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Lock size={18} className="mr-2" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPassword.new ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPassword.confirm ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Update Password
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordFields(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;