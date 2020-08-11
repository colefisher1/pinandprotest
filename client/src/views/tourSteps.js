import Guidelines from "./Guidelines";

export const steps = [
    {
      id: 'guidelines',
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Understood',
          type: 'next',
        }
      ],
      title: 'Guidelines',
      text: ['guidelines heereee']
    },
    {
      id: 'addprotest',
      attachTo: {element: '.addpin', on: 'top'},
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'next',
          type: 'next',
        }
      ],
      title: 'Add a Protest',
      text: ['You can add a protest by clicking on the map']
    },
    {
      id: 'protestHistory',
      attachTo: {element: '.protest-history', on: 'top'},
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            window.scrollTo(0, 0);
            resolve();
          }, 500);
        });
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next',
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Welcome to React-Shepherd!',
      text: ['In the protest history you can see your reported protests. Clicking on them will take you to the map where you can delete them!'],
      when: {
        show: () => {
          console.log('show step');
        },
        hide: () => {
          console.log('hide step');
        }
      }
    },
    {
      id: 'commentHistory',
      attachTo: {element: '.comment-history', on: 'top'},
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            window.scrollTo(0, 0);
            resolve();
          }, 500);
        });
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next',
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Back',
          type: 'back',
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Welcome to React-Shepherd!',
      text: ['In the comment history you can see your reported protests. Clicking on them will take you to the discussion where you can see them!'],
      when: {
        show: () => {
          console.log('show step');
        },
        hide: () => {
          console.log('hide step');
        }
      }
    }
    
  ];