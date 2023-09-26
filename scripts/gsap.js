function handleGsap() {
    return new Promise((resolve, reject) => {
        try {
            console.log("gsaping")
            gsap.to("#weeklyadContainer", {
                delay: 3,
                marginTop: "1000px",
            });
            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}
