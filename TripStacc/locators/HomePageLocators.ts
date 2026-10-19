export const HomePageLocators = {
  cardPopup: `//h4[@class="modal-title popuptitle"]`,
  cardOption: `//div[@class="card-content-wrapper"]`,
  continueButton: `//button[text()='Continue']`,
  // Home page sections. Flights and Hotels tabs both render their banner; the inactive one is hidden (d-none).
  // <header> and the search <form>s have 0px height (sticky/floated children), so check their sized containers instead
  header: `//header//div[@class="newHeader_box"] >> visible=true >> nth=0`,
  searchWidget: `//div[@id="search_area"] >> visible=true >> nth=0`,
  banner: `//div[@id="myCarouselflight"] | //div[@id="myCarouselhotel"] >> visible=true >> nth=0`,
  footer: `//footer >> visible=true >> nth=0`,

  // Header
  logo: `//header//img[@alt="Logo"] >> visible=true >> nth=0`,
  flightsTab: `//a[@id="flights_link"]`,
  hotelsTab: `//a[@id="hotels_link"]`,
  profileIcon: `//header//a[contains(@class,"sso_login_div")]`,

  // Banner carousel (previous/next arrows exist only on the Flights tab banner)
  bannerActiveSlide: `//div[contains(@class,"carousel slide")]//div[contains(@class,"item") and contains(@class,"active")] >> visible=true >> nth=0`,
  // The active slide is just an <img> (no caption text) - compare its src to detect rotation/navigation
  bannerActiveSlideImage: `//div[contains(@class,"carousel slide")]//div[contains(@class,"item") and contains(@class,"active")]//img >> visible=true >> nth=0`,
  bannerPreviousButton: `//div[contains(@class,"carousel slide")]//a[@data-slide="prev"] >> visible=true >> nth=0`,
  bannerNextButton: `//div[contains(@class,"carousel slide")]//a[@data-slide="next"] >> visible=true >> nth=0`,
  bannerIndicators: `//ol[@class="carousel-indicators"] >> visible=true >> nth=0`,

  // Search widget — #search_area has class searcharea_flight or searcharea_hotel depending on the active tab
  flightSearchArea: `//div[@id="search_area" and contains(@class,"searcharea_flight")]`,
  oneWayOption: `//input[@id="onew-trp"]/parent::label`,
  roundTripOption: `//input[@id="rnd-trp"]/parent::label`,
  fromField: `//input[@id="from"] >> visible=true >> nth=0`,
  toField: `//input[@id="to"] >> visible=true >> nth=0`,
  departureDateField: `//input[@id="flight_datepicker1"]`,
  returnDateField: `//input[@id="flight_datepicker2"]`,
  travellersAndCabinClass: `//div[contains(@class,"totlall") and contains(@class,"mainSearchbox")]`,
  searchFlightsButton: `//input[@id="flight-form-submit"]`,
  hotelLocationField: `//input[@id="location"]`,
  hotelCheckInField: `//input[@id="hotel_daterange"]`,
  hotelCheckOutField: `//input[@id="hotel_daterange2"]`,
  hotelRoomsAndGuestsField: `//input[@id="room_and_guests"]`,
  searchHotelsButton: `//input[@id="hotel_search_btn"]`,
  recentSearchesTitle: `//p[@class="recentTitle"] >> visible=true >> nth=0`,
  recentSearchCard: `//a[@class="recentCard" or @class="recent_crd"] >> visible=true >> nth=0`,

  // Body sections
  myTripsAndBookings: `//div[@class="mytripbookings"] >> visible=true >> nth=0`,
  myTripsManageLink: `//div[@class="mytripbookings"]//a >> visible=true >> nth=0`,
  bestOffersSection: `//div[contains(@class,"best_value_home")] >> visible=true >> nth=0`,
  bestOfferCard: `//li[contains(@class,"bestValueModalBtn") or contains(@class,"bestValueHotelModalBtn")] >> visible=true >> nth=0`,
  bestOfferCardsAll: `//li[contains(@class,"bestValueModalBtn") or contains(@class,"bestValueHotelModalBtn")] >> visible=true`,
  bankOffersSection: `//section[contains(@class,"bank_offer")]`,
  // This section renders as an Owl Carousel (not the Bootstrap data-slide carousel used by the hero banner);
  // its nav arrows carry an explicit "disabled" class with only 3 slides, so only the promo images are checked
  bankOffersImages: `//section[contains(@class,"bank_offer")]//img >> visible=true`,
  whyBookSection: `//div[@class="why_loyalty"]`,
  whyBookItems: `//div[@class="why_loyalty"]//h5`,
  faqSection: `//div[@class="api_faq"]`,
  faqCategoryTabs: `//div[@class="api_faq"]//a[@href="#home" or @href="#menu2" or @href="#menu3"]`,
  faqQuestion: `//div[@class="api_faq"]//*[@role="tab"] >> visible=true >> nth=0`,
  // Per-category FAQ tabs and their Bootstrap tab-pane panels
  faqGeneralTab: `//div[@class="api_faq"]//a[@href="#home"]`,
  faqFlightsTab: `//div[@class="api_faq"]//a[@href="#menu2"]`,
  faqHotelsTab: `//div[@class="api_faq"]//a[@href="#menu3"]`,
  faqGeneralPanel: `//div[@id="home"]`,
  faqFlightsPanel: `//div[@id="menu2"]`,
  faqHotelsPanel: `//div[@id="menu3"]`,
  needHelpSection: `//div[@class="contactusBox"]`,
  needHelpMobile: `//div[@class="contactusBox"]//p[contains(.,"Mobile")]//a`,
  needHelpEmail: `//div[@class="contactusBox"]//p[contains(.,"Email")]//a`,

  // Footer
  footerPoweredBy: `//footer//h6[@class="pwrd_by"]`,
  footerFlightsLink: `//a[@id="flights_link_footer"]`,
  footerHotelsLink: `//a[@id="hotels_link_footer"]`,
  footerContactUsLink: `//footer//a[contains(@class,"contact-us-clicked")]`,
  footerAboutUsLink: `//footer//a[contains(@href,"about-us")]`,
  footerRefundPolicyLink: `//footer//a[contains(@href,"refund-policy")]`,
  footerTermsLink: `//footer//a[contains(@href,"terms-conditions")]`,
  footerPrivacyPolicyLink: `//footer//a[contains(@href,"privacy-policy")]`,
  footerCopyright: `//div[@class="btmfooternw"]`
}
