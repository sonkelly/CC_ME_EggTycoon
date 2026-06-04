import { sys } from "cc";
import { GamePlatform } from "./Defines";
import PlatformManager from "../Platforms/PlatformManager";

const DataManager = {
  _tryLoadGameData: 0,
  _getGameData: false,
  version: "001",
  GameData: {
    music: true,
    sound: true,
    coin: 0,
    localLanguage: "ru",
  },
  storeGameData: function (key = null, value = null) {
    let data = JSON.stringify(DataManager.GameData);
    let encriptData = CryptoJS.AES.encrypt(data, 'rYmWetvqSHEc8o0Y');
    sys.localStorage.setItem("GameData", encriptData);
  },
  getGameData() {
    return new Promise((resolve: any, _reject) => {
      if (DataManager._getGameData) {
        resolve();
      } else {
        let data = sys.localStorage.getItem("GameData");
        if (data) {
          data = CryptoJS.AES.decrypt(data, 'rYmWetvqSHEc8o0Y');
          data = data.toString(CryptoJS.enc.Utf8)
        }
        data = data ? JSON.parse(data) : {};
        if (data && Object.keys(data).length > 0 && data.constructor === Object
        ) {
          Object.keys(data).forEach(key => {
            DataManager.GameData[key] = data[key];
          });
        }

        DataManager._tryLoadGameData = 0;
        DataManager._getGameData = true;
        resolve();
      }
    });
  },

  addCoin(value: number) {
    DataManager.GameData.coin += value;
    DataManager.storeGameData("coin", DataManager.GameData.coin);
  },

  getCoin() {
    return DataManager.GameData.coin;
  },

  getMusic() {
    return DataManager.GameData.music;
  },
  setMusic(music) {
    DataManager.GameData.music = music;
    DataManager.storeGameData("music", music);
  },
  getSound() {
    return DataManager.GameData.sound;
  },
  setSound(sound) {
    DataManager.GameData.sound = sound;
    DataManager.storeGameData("sound", sound);
  },


  RemoteConfig: {
    safeMode: 1,
    clickSound: 1,
    freeAllSongs: 1,
    freeToSongs: 2,
    freeHalfSongs: 0,
    watchAdsAtStart: false,
    watchAdsNoThanks: true,
    watchAdsPlayBtn: false,
    adsSpaceTime: 60, //60s
    usingHowler: 1,
    howlerHtml5: 0,
    songPrice: 0,
    cdn: "https://bhct.seaside-game.com",
    songListsUrl: "",
    themeDefault: 3,
  },
  FetchRemoteConfig: (cb) => {
    if (window.ysdk) {
      window.ysdk.getFlags().then((flags) => {
        if (flags) {
          for (let prop in flags) {
            if (flags.hasOwnProperty(prop) && prop.indexOf("forVersion") == -1) {
              if (typeof DataManager.RemoteConfig[prop] == 'string') {
                DataManager.RemoteConfig[prop] = flags[prop];
              } else {
                DataManager.RemoteConfig[prop] = parseInt(flags[prop]);
              }
            }
          }

          let forVersion = flags["forVersion_" + DataManager.version];
          if (forVersion) {
            let settingsForVersion = JSON.parse(forVersion);
            if (settingsForVersion) {
              for (let prop in settingsForVersion) {
                if (settingsForVersion.hasOwnProperty(prop)) {
                  if (typeof DataManager.RemoteConfig[prop] == 'string') {
                    DataManager.RemoteConfig[prop] = settingsForVersion[prop];
                  } else {
                    DataManager.RemoteConfig[prop] = parseInt(settingsForVersion[prop]);
                  }
                }
              }
            }
          }
        }

        if (DataManager.RemoteConfig.howlerHtml5 === 2) {
          if (sys.isMobile) {
            DataManager.RemoteConfig.howlerHtml5 = 0;
          } else {
            DataManager.RemoteConfig.howlerHtml5 = 1;
          }
        }
        if (cb) {
          console.log(DataManager.RemoteConfig);
          cb();
        }
      })
    } else {
      if (cb) {
        cb();
      }
    }
  },


  _i18n: null,
  language: "en",
  supportLanguages: ["en", "ru", "tr", "ko", "zh", "ja", "de"],
  setupLanguage(lang) {
    if (DataManager.supportLanguages.indexOf(lang) > -1) {
      DataManager.language = lang;
      DataManager._i18n = (window as any)._languageData as any;
      DataManager._i18n.init(lang);
    }
  },
  getI18n() {
    return DataManager._i18n;
  },
  setLanguageSetting(lang) {
    DataManager.GameData.localLanguage = lang;
    DataManager.updateLanguage();
    DataManager.storeGameData("language", DataManager.GameData.localLanguage);

  },
  updateLanguage() {
    DataManager._i18n.init(DataManager.GameData.localLanguage); // Thay đổi ngôn ngữ
    DataManager._i18n.updateSceneRenderers(); // Cập nhật tất cả label
  },
  getLanguage() {
    let language = PlatformManager.getLanguage();

    if (PlatformManager.type == GamePlatform.LOCAL) {
      language = DataManager.GameData.localLanguage; // get language setting
    }

    if (!language) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      language = urlParams.get("lang");
    }

    if (!language) {
      language = window.navigator.userLanguage || window.navigator.language;
    }

    if (!language) {
      language = "en";
    }
    return language;
  },
};

export default DataManager;