import { useEffect, useState } from 'react';
import img1 from '../assets/dreamJob.png'
import Navbar from '../Components/Navbar';
import Title from '../Components/Title';
import SplashScreen from '../Components/SplashScreen';
import { useTranslation } from 'react-i18next';


const Home = () => {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };
   

  
  

    
    
    
    

    return (
      <div>
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <Navbar />
          <header className="App-header ps-40 py-10">
            <h1>{t('welcome')}</h1>
            <p>{t('description')}</p>

            {/* Language Buttons */}
            {/* <div className="">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 border-2 mr-4 transform transition-all duration-300 ease-in-out ${
                  i18n.language === 'en'
                    ? 'bg-black text-white scale-110'
                    : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                English
              </button>

              <button
                onClick={() => changeLanguage('bn')}
                className={`px-3 py-1 border-2 transform transition-all duration-300 ease-in-out ${
                  i18n.language === 'bn'
                    ? 'bg-black text-white scale-110'
                    : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                বাংলা
              </button>
            </div> */}

   
   
          </header>

          <Title title="This is Home" />

          {/* Rest of your sections */}
          <section className="flex items-start mx-20 my-5 p-2 border-2 rounded-md relative">
            <div className="absolute">
              <div className="bg-white/90">
                <img src={img1} className="h-60 w-60" alt="" />
              </div>
            </div>
            <div className="flex-1 bg-violet-100 h-60 flex flex-col justify-evenly ps-72 rounded-s-full px-6">
              <div>
                <h1
                  className={`font-semibold text-2xl ${
                    i18n.language === 'bn' ? 'font-bangla' : ''
                  }`}
                >
                  {t('title')}
                </h1>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Accusamus ut velit veritatis mollitia quo sint, nemo fuga
                  laboriosam distinctio dolore?
                </p>
              </div>
              <div className="gap-2 flex">
                <button className="bg-teal-500 px-2 py-1 rounded-sm text-white">
                  Yes
                </button>
                <button className="bg-teal-500 px-2 py-1 rounded-sm text-white">
                  Like
                </button>
                <button className="bg-teal-500 px-2 py-1 rounded-sm text-white">
                  Buy
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
    );
};

export default Home; 