import i18n from "../i18n";

export const getHeaderName = (type) => {
  switch (type) {
    case "/dashboard":
      return i18n.t("Header.Dashboard");
    case "/login":
      return i18n.t("Header.WelcomeBack");
    case "/":
      return i18n.t("Header.WelcomeBack");
    case "/changeLanguage":
      return i18n.t("Header.ChangeLanguage");
    case "/usermanagement":
      return i18n.t("Header.UserManagement");
    case "/adminsetting":
      return i18n.t("Header.AdminSetting");
    case "/reply":
      return i18n.t("Header.ReplyForClients");
    case "/pushnotification":
      return i18n.t("Header.NotificationManagement");
  }
};

export const callAppId = "b6bd836cb84b4c16af13e61eb114ff1e";
export const videoChannelId = "sasuga_channel";
export const audioChannelId = "sasuga_channel";
export const videoToken =
  "007eJxTYLgzPXlTE8eas4kXz73mzPm77pXbAoFzcrbOQZZGDRu4nlxWYEgyS0qxMDZLTrIwSTJJNjRLTDM0TjUzTE0yNDRJSzNM/XLGM7UhkJHh+eUXTIwMEAji8zEUJxaXpifGJ2ck5uWl5jAwAABncCab";
export const audioToken =
  "007eJxTYGB2eDQj++rFvYrF0zv+TV3w7GrTvX2u+hJti3TSRC77LTBWYEi1NDNONUy2SE4zMTBJMzNPSkozMk1LNbY0SklNSTNPfmxpndoQyMhwXDOQhZEBAkF8QYbkxJyc+MTSlMz8+OLE4tL0RAYGAJ4PJhY=";
export const callAdminDcoId = "hO01sqCg552JEdhQMGae";
export const firebaseAdminId = "VVpfTUF6nPgK2iVX3tYAVO4Ae352";

export const CallApp_ID = "b6bd836cb84b4c16af13e61eb114ff1e";
export const Channel_Name = "test_call";
export const Channel_TOken =
  "007eJxTYGCU/hseujd1esriayXtumWLXBmeRNRK/15xqXNvSpJ+p4UCQ5JZUoqFsVlykoVJkkmyoVlimqFxqplhapKhoUlammGqt5J3akMgI8PZiamMjAwQCOJzMpSkFpfEJyfm5DAwAADNSSD5";
