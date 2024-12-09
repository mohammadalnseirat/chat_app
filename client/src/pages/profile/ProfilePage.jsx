import { useAppStore } from "@/store";

const ProfilePage = () => {
  const {userInfo} = useAppStore()
  return <div>ProfilePage
    <div>
      Email: {userInfo?.email}
    </div>
  </div>;
};

export default ProfilePage;
