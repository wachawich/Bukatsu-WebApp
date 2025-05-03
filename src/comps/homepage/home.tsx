import React, { useEffect, useState } from 'react'
import { getUser, postUser } from "@/utils/api/userData"
import ActivityList from './activityList';
import SubjectCard from './subjectCard';
function Homepage() {
  const [sima, setSima] = useState<any>(null);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       console.log("siam")

  //       const getuserFeild: any = {
  //         user_sys_id: 0
  //       }
  //       console.log("getuserFeild", getuserFeild)

  //       const user = await postUser(getuserFeild);
  //       console.log("user", user)
  //       // setSima(user);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   }, 5000); // 1000ms = 1 วินาที

  //   // Cleanup เมื่อ component ถูก unmount
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className='bg-white'> 
    
    <SubjectCard />
    <ActivityList/>


    </div>
  )
}

export default Homepage