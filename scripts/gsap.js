gsap.registerPlugin(ScrollTrigger);

function handleGsap() {
    return new Promise((resolve, reject) => {
        try {
            console.log("gsaping")
            ScrollTrigger.refresh();
            /* gsap.to("#scrollPrint", {
                delay: 3,
                marginTop: "1000px",
            }); */

            ScrollTrigger.create({
                trigger: ".scrollContainer",
                start: "top top",
                end: "bottom 150px",
                markers: true,
                pin: true
            });
            /* ScrollTrigger.create({
                trigger: ".card",
                start: "top top",
                end: "bottom 50px",
                pin: true
            }); */

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}
