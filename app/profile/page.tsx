import { ProfileView } from '@/components/features/ProfileView';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-black pt-20 pb-24 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    Your Account
                </h1>
                <ProfileView />
            </div>
        </div>
    );
}
