//gsap.registerPlugin(ScrollTrigger);

function handleAnimations() {
    return new Promise((resolve, reject) => {
        try {
            /*console.log("gsaping")
            ScrollTrigger.refresh();

            ScrollTrigger.create({
                trigger: ".scrollContainer",
                start: "top top",
                end: "bottom 150px",
                markers: true,
                pin: true
            });
             ScrollTrigger.create({
                trigger: ".card",
                start: "top top",
                end: "bottom 50px",
                pin: true
            }); */
            //Sortable.mount(new AutoScroll());
            let example = document.getElementById('listCardContainer')
            new Sortable(example, {
                animation: 300,
                ghostClass: 'ghost',
                delay: 100,
                delayOnTouchOnly: true,
                scroll: true,
                bubbleScroll: true
            });

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}
