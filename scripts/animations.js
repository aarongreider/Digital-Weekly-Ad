function handleAnimations() {
    return new Promise((resolve, reject) => {
        try {
            //Sortable.mount(new AutoScroll());
            let listCardContainer = document.getElementById('listCardContainer')
            let scrollContainer = document.getElementsByClassName('scrollContainer')[0]
            
            new Sortable(listCardContainer, {
                animation: 300,
                ghostClass: 'ghost',
                delay: 100,
                delayOnTouchOnly: true,
                handle: '.dragIcon',
                /* forceFallback: true, */
                scroll: false,
                //scrollSensitivity: 30,
                //bubbleScroll: false,
                /* scrollFn: function (offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {
                    if (touchEvt.srcElement.classList.contains('listCard')) {
                        scrollContainer.scrollTop += offsetY*10
                        touchEvt.srcElement
                        //console.log(offsetY)
                        //.log(originalEvent.srcElement.outerHTML)
                        //console.log(hoverTargetEl)
                        //console.log(touchEvt.srcElement)
                    }


                }, */
                
            });

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}

