!define BROWSER_CLIENT_KEY "Software\Clients\StartMenuInternet\${APP_EXECUTABLE_FILENAME}"
!define BROWSER_CAPABILITIES_KEY "${BROWSER_CLIENT_KEY}\Capabilities"
!define BROWSER_URL_PROG_ID "${APP_EXECUTABLE_FILENAME}.URL"

!macro customInit
  ${ifNot} ${isUpdated}
    MessageBox MB_YESNO|MB_ICONQUESTION "是否安装 ${PRODUCT_NAME}？" IDYES +2
    Abort
  ${endif}
!macroend

!macro customInstall
  WriteRegStr HKCU "${BROWSER_CLIENT_KEY}" "" "${PRODUCT_NAME}"
  WriteRegStr HKCU "${BROWSER_CLIENT_KEY}\DefaultIcon" "" "$appExe,0"
  WriteRegStr HKCU "${BROWSER_CLIENT_KEY}\shell\open\command" "" '$\"$appExe$\"'
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}" "ApplicationName" "${PRODUCT_NAME}"
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}" "ApplicationDescription" "${PRODUCT_NAME}"
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}" "ApplicationIcon" "$appExe,0"
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}\Startmenu" "StartMenuInternet" "${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}\UrlAssociations" "http" "${BROWSER_URL_PROG_ID}"
  WriteRegStr HKCU "${BROWSER_CAPABILITIES_KEY}\UrlAssociations" "https" "${BROWSER_URL_PROG_ID}"
  WriteRegStr HKCU "Software\RegisteredApplications" "${PRODUCT_NAME}" "${BROWSER_CAPABILITIES_KEY}"
  WriteRegStr HKCU "Software\Classes\${BROWSER_URL_PROG_ID}" "" "${PRODUCT_NAME} URL"
  WriteRegStr HKCU "Software\Classes\${BROWSER_URL_PROG_ID}" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\${BROWSER_URL_PROG_ID}\DefaultIcon" "" "$appExe,0"
  WriteRegStr HKCU "Software\Classes\${BROWSER_URL_PROG_ID}\shell\open\command" "" '$\"$appExe$\" $\"%1$\"'
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend

!macro customUnInstall
  DeleteRegValue HKCU "Software\RegisteredApplications" "${PRODUCT_NAME}"
  DeleteRegKey HKCU "${BROWSER_CLIENT_KEY}"
  DeleteRegKey HKCU "Software\Classes\${BROWSER_URL_PROG_ID}"
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend
