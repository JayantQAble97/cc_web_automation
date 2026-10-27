# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TripStacc/tests/FlightPage.test.ts >> SC_004.01: Update Search 
- Location: TripStacc/tests/FlightPage.test.ts:750:5

# Error details

```
Error: Assertion error
```

```
Error: page.reload: Target page, context or browser has been closed
Call log:
  - waiting for navigation until "load"

```

# Test source

```ts
  685 |   });
  686 | 
  687 |   await test.step("Step 35: Verify Filter Arrival Time Early Morning Return details", async () => {
  688 |     await FlightHomePage.VerifyFilterArrivalTimeEarlyMorningReturnVisible(page);
  689 |   });
  690 | 
  691 |   await test.step("Step 36: Verify Filter Arrival Time Morning Return details", async () => {
  692 |     await FlightHomePage.VerifyFilterArrivalTimeMorningReturnVisible(page);
  693 |   });
  694 | 
  695 |   await test.step("Step 37: Verify Filter Arrival Time Afternoon Return details", async () => {
  696 |     await FlightHomePage.VerifyFilterArrivalTimeAfternoonReturnVisible(page);
  697 |   });
  698 | 
  699 |   await test.step("Step 38: Verify Filter Arrival Time Evening Return details", async () => {
  700 |     await FlightHomePage.VerifyFilterArrivalTimeEveningReturnVisible(page);
  701 |   });
  702 |   await test.step("Step 39: Click on Fare Filter TabButton", async () => {
  703 |     await FlightHomePage.clickOnfilterTabFareTypeTabButton(page);
  704 |   });
  705 | 
  706 |   await test.step("Step 40: get Refundable filter text", async () => {
  707 |     await FlightHomePage.selectRefundableFilter(page);
  708 |   });
  709 | 
  710 |   await test.step("Step 41: Click on Filter Apply Button", async () => {
  711 |     await FlightHomePage.clickOnFilterApplyButton(page);
  712 |   });
  713 | 
  714 |   await test.step("Step 42: Verify Refundable details", async () => {
  715 |     await FlightHomePage.verifyRefundableDetails(page);
  716 |   });
  717 | 
  718 |   await test.step("Step 43: Click on Filter Button", async () => {
  719 |     await FlightHomePage.clickOnFilterListButton(page);
  720 |   });
  721 | 
  722 |   await test.step("Step 44: Click on Fare Filter TabButton", async () => {
  723 |     await FlightHomePage.clickOnfilterTabFareTypeTabButton(page);
  724 |   });
  725 | 
  726 |   await test.step("Step 45: Click on filter Tab Fare Type Refundable Button", async () => {
  727 |     await FlightHomePage.clickOnfilterTabFareTypeRefundableButton(page);
  728 |   });
  729 | 
  730 |   await test.step("Step 46: get non-Refundable filter text", async () => {
  731 |     await FlightHomePage.selectNonRefundableFilter(page);
  732 |   });
  733 |   await test.step("Step 50: Click filter Airline Tab Button", async () => {
  734 |     await page.waitForTimeout(7000);
  735 |     await FlightHomePage.clickOnfilterAirlineTabButton(page);
  736 |   });
  737 |   await test.step("Step 51: get First Airline text", async () => {
  738 |     await page.waitForTimeout(7000);
  739 |     await FlightHomePage.selectFirstAirlineFilter(page);
  740 |   });
  741 |   await test.step("Step 52: Click on Filter Apply Button", async () => {
  742 |     await FlightHomePage.clickOnFilterApplyButton(page);
  743 |   });
  744 |   await test.step("Step 53: Verify Filtered Airlines", async () => {
  745 |      await FlightHomePage.verifyFilteredAirlines(page);
  746 |   });
  747 | 
  748 | });
  749 | 
  750 | test('SC_004.01: Update Search ', { tag: ['@idfc', '@bob', '@common','@homepageflight', '@regression', '@sanity'] }, async () => {
  751 |   await test.step("Step 1: Enter City From Airport", async () => {
  752 |     await page.waitForTimeout(5000);
  753 |     await FlightHomePage.clickOnCityFromAirport(page);
  754 |     await FlightHomePage.EnterCityFromAirport(page, "del");
  755 |   })
  756 | 
  757 |   await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
  758 |     await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
  759 |     await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  760 |   })
  761 | 
  762 |   await test.step("Step 3: Enter City To Airport", async () => {
  763 |     await FlightHomePage.clickOnToAirport(page);
  764 |     await FlightHomePage.EnterCityToAirport(page, "Mum");
  765 |   })
  766 | 
  767 |   await test.step("Step 4: Verify To Airport Dropdown Visible", async () => {
  768 |     await FlightHomePage.VerifyToAirpotDropdownVisible(page);
  769 |     await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  770 |   })
  771 | 
  772 |   await test.step("Step 5: Enter date of departure", async () => {
  773 |     await page.waitForTimeout(5000);
  774 |     await FlightHomePage.clickOnDepartureDate(page);
  775 |     await FlightHomePage.selectTomorrowDateForDeparture(page);
  776 |   })
  777 | 
  778 |   await test.step("Step 7: Click search flights button", async () => {
  779 |     await FlightHomePage.clickOnSearchFlightsButton(page);
  780 |   });
  781 | 
  782 | 
  783 |   await test.step('Go back and reload page', async () => {
  784 |     await page.goBack();
> 785 |     await page.reload();
      |                ^ Error: page.reload: Target page, context or browser has been closed
  786 |     await page.waitForTimeout(3000);
  787 |   });
  788 | 
  789 |   await test.step('Click on City From Airport field', async () => {
  790 |     await FlightHomePage.clickOnCityFromAirport(page);
  791 |     await FlightHomePage.EnterCityFromAirport(page, "del");
  792 |   });
  793 | })
  794 | 
  795 | test('SC_005: Add Traveller Details and Update Traveller Details ', { tag: ['@idfc', '@bob', '@common', '@flaky', '@homepageflight', '@regression', '@sanity'] }, async () => {
  796 |   await test.step("Step 1: Enter City From Airport", async () => {
  797 |     await page.waitForTimeout(5000);
  798 |     await FlightHomePage.clickOnCityFromAirport(page);
  799 |     await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  800 |   })
  801 | 
  802 |   await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
  803 |     await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
  804 |     await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  805 |   })
  806 | 
  807 |   await test.step("Step 3: Enter City To Airport", async () => {
  808 |     await page.waitForTimeout(5000);
  809 |     await FlightHomePage.clickOnToAirport(page);
  810 |     await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  811 |   })
  812 | 
  813 |   await test.step("Step 4: Verify To Airport Dropdown Visible", async () => {
  814 |     await FlightHomePage.VerifyToAirpotDropdownVisible(page);
  815 |     await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  816 |   })
  817 | 
  818 |   await test.step("Step 5: Enter date of departure", async () => {
  819 |     await page.waitForTimeout(5000);
  820 |     await FlightHomePage.clickOnDepartureDate(page);
  821 |     await FlightHomePage.selectTomorrowDateForDeparture(page);
  822 |   })
  823 | 
  824 |   await test.step("Step 6: Click and verify travellers and cabin class dropdown", async () => {
  825 |     await page.waitForTimeout(5000);
  826 |     await FlightHomePage.clickOntravellersAndCabinClass(page);
  827 |     await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
  828 |     await FlightHomePage.clickOnApplyButton(page);
  829 |     await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
  830 |     await page.waitForTimeout(3000);
  831 |   });
  832 | 
  833 |   await test.step("Step 7: Click search flights button", async () => {
  834 |     await FlightHomePage.clickOnSearchFlightsButton(page);
  835 |   });
  836 | 
  837 |   await test.step("Step 8: Verify first flight card visible", async () => {
  838 |     await FlightHomePage.VerifyFirstFlightCardVisible(page);
  839 |   });
  840 |   await test.step("Step 9: Click on Next Button On Flight Details Page", async () => {
  841 |     await FlightHomePage.clickOnNextButtonOnFlightDetailsPage(page);
  842 |   });
  843 |   await test.step("Step 10: Click on Book Button On Flight Details Page", async () => {
  844 |     await FlightHomePage.clickOnBookButtonOnFlightDetailsPage(page);
  845 |   });
  846 |   await test.step("Step 11: Click on Continue Button On Flight Details Page", async () => {
  847 |     await FlightHomePage.clickOnContinueButtonOnFlightDetailsPage(page);
  848 |   });
  849 | 
  850 |   await test.step("Step 12: Click on Add New Traveller Button On Traveller Details Page", async () => {
  851 |     await FlightHomePage.clickOnAddNewTravellerButton(page);
  852 |   });
  853 | 
  854 |   await test.step("Step 13: Click on Mr. Gender Button On Traveller Details Page", async () => {
  855 |     await FlightHomePage.clickOnMrGenderButton(page);
  856 |   });
  857 | 
  858 |   await test.step("Step 16: Enter Wrong First Name of Traveller", async () => {
  859 |     await FlightHomePage.EnterWrongFirstName(page, Data.travellername.WrongfirstName);
  860 |   });
  861 |   await test.step("Step 14: Verify First Name Error Visible", async () => {
  862 |     await FlightHomePage.VerifyFirstNameErrorMessageVisible(page);
  863 |   });
  864 |   await test.step("Step 17: Enter Wrong Last Name of Traveller", async () => {
  865 |     await FlightHomePage.EnterWrongLastName(page, Data.travellername.WronglastName);
  866 |   });
  867 |   await test.step("Step 15: Verify Last Name Error Visible", async () => {
  868 |     await FlightHomePage.VerifyLastNameErrorMessageVisible(page);
  869 |   });
  870 | 
  871 |   await test.step("Step 16: Enter First Name of Traveller", async () => {
  872 |     await FlightHomePage.EnterFirstName(page, Data.travellername.firstName);
  873 |   });
  874 | 
  875 |   await test.step("Step 17: Enter Last Name of Traveller", async () => {
  876 |     await FlightHomePage.EnterLastName(page, Data.travellername.lastName);
  877 |   });
  878 | 
  879 |   await test.step("Step 18: Click on Add Traveller Button On Traveller Details Page", async () => {
  880 |     await FlightHomePage.selectPassportDetailstravellerpage(page)
  881 |     await FlightHomePage.clickOnAddTravellerButton(page);
  882 |   });
  883 | 
  884 |   await test.step("Step 19: Verify First Traveller Name Visible on the traveller details page", async () => {
  885 |     await FlightHomePage.verifyFirstTravellerNameOnTravellerDetailPage(page);
```