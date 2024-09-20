

import { useEffect, useState } from "react";
import Title from "../Components/Title";
import SplashScreen from "../Components/SplashScreen";
import Chat from "../Chat";



const Iiuc = () => {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
       const timer = setTimeout(() => {
           setLoading(false);
       }, 1000); // Show splash screen for 3 seconds

       return () => clearTimeout(timer); // Cleanup the timer
   }, []);
   //  const jutas =[
   //      {
   //         'title': "Juta1",
   //         'description': "Juta1 description",
   //         'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //         'price': "100"
   //      },
   //      {
   //          'title': "Juta2",
   //          'description': "Juta1 description",
   //          'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //          'price': "100"
   //       },
   //       {
   //          'title': "Juta3",
   //          'description': "Juta1 description",
   //          'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //          'price': "100"
   //       },
   //       {
   //          'title': "Juta4",
   //          'description': "Juta1 description",
   //          'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //          'price': "100"
   //       },
   //       {
   //          'title': "Juta5",
   //          'description': "Juta1 description",
   //          'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //          'price': "100"
   //       },
   //       {
   //          'title': "Juta6",
   //          'description': "Juta1 description",
   //          'img': "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
   //          'price': "100"
   //       },
   //  ]
 


    return (
      <div className="">
          {loading ? <SplashScreen /> :         <div>
            <Title title="Ifti's friend"/>

            
            <Chat/>
        
        {/* {
            jutas.map((juta,i)=> <JuterCard key={i} ju={juta} />)
        } */}
        

        
        </div> }
      </div>

    );
};

export default Iiuc; 