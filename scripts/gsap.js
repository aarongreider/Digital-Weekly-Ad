//gsap.registerPlugin(ScrollTrigger);

function handleGsap() {
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
            let example = document.getElementById('listCardContainer')
            new Sortable(example, {
                animation: 150,
                ghostClass: 'listCard'
            });

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}
