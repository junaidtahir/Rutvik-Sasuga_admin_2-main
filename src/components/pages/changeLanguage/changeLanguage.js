import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const ChangeLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(sessionStorage.getItem('selectedLanguage') || 'en');

  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage]);

  const changeLanguage = (ln) => {
    setSelectedLanguage(ln);
    sessionStorage.setItem('selectedLanguage', ln);
  }

  return (
    <div className="radioButtons">
      <input type="radio" id="english" name="fav_language" value="English" checked={selectedLanguage === 'en'} onClick={() => changeLanguage('en')}/>
      <label for="english" className="labels">English</label><br />
      <input type="radio" id="korean" name="fav_language" value="Korean" checked={selectedLanguage === 'ko'} onClick={() => changeLanguage('ko')}/>
      <label for="korean" className="labels">Korean</label><br />
      <input type="radio" id="japanese" name="fav_language" value="Japanese" checked={selectedLanguage === 'jp'} onClick={() => changeLanguage('jp')}/>
      <label for="japanese" className="labels">Japanese</label>
    </div>
  );
};

export default ChangeLanguage;
