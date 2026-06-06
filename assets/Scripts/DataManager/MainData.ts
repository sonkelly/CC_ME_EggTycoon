import { sys } from "cc";
import { GamePlatform } from "../Common/Defines";
import PlatformManager from "../Platforms/PlatformManager";

const MainData = {
  _tryLoadData: 0,
  _getData: false,
  _key: "MainData",
  LocalData: {
    music: true,
    sound: true,
    localLanguage: "ru",
  },
  saveLocalData: function (key = null, value = null) {
    let data = JSON.stringify(MainData.LocalData);
    let encriptData = CryptoJS.AES.encrypt(data, 'rYmWetvqSHEc8o0Y');
    sys.localStorage.setItem(MainData._key, encriptData);
  },
  loadLocalData() {
    return new Promise((resolve: any, _reject) => {
      if (MainData._getData) {
        resolve();
      } else {
        let data = sys.localStorage.getItem(MainData._key);
        if (data) {
          data = CryptoJS.AES.decrypt(data, 'rYmWetvqSHEc8o0Y');
          data = data.toString(CryptoJS.enc.Utf8)
        }
        data = data ? JSON.parse(data) : {};
        if (data && Object.keys(data).length > 0 && data.constructor === Object
        ) {
          Object.keys(data).forEach(key => {
            MainData.LocalData[key] = data[key];
          });
        }

        MainData._tryLoadData = 0;
        MainData._getData = true;
        resolve();
      }
    });
  },


  getMusic() {
    return MainData.LocalData.music;
  },
  setMusic(music) {
    MainData.LocalData.music = music;
    MainData.saveLocalData();
  },
  getSound() {
    return MainData.LocalData.sound;
  },
  setSound(sound) {
    MainData.LocalData.sound = sound;
    MainData.saveLocalData();
  },



  _i18n: null,
  language: "en",
  supportLanguages: ["en", "ru", "tr", "ko", "zh", "ja", "de"],
  setupLanguage(lang) {
    if (MainData.supportLanguages.indexOf(lang) > -1) {
      MainData.language = lang;
      MainData._i18n = (window as any)._languageData as any;
      MainData._i18n.init(lang);
    }
  },
  getI18n() {
    return MainData._i18n;
  },
  setLanguageSetting(lang) {
    MainData.LocalData.localLanguage = lang;
    MainData.updateLanguage();
    MainData.saveLocalData();

  },
  updateLanguage() {
    MainData._i18n.init(MainData.LocalData.localLanguage); // Thay đổi ngôn ngữ
    MainData._i18n.updateSceneRenderers(); // Cập nhật tất cả label
  },
  getLanguage() {
    let language = PlatformManager.getLanguage();

    if (PlatformManager.type == GamePlatform.LOCAL) {
      language = MainData.LocalData.localLanguage; // get language setting
    }

    if (!language) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      language = urlParams.get("lang");
    }

    if (!language) {
      language = (window.navigator as any).userLanguage || window.navigator.language;
    }

    if (!language) {
      language = "en";
    }
    return language;
  },
};

export default MainData;