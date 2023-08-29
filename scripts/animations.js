const points = [0, 500, 1000, 1500]

Draggable.create(".Wr", {
      type: 'scrollTop',
      //lockAxis: true,
      bounds: ".Wr",
      throwProps: true,
      dragClickables: true,
      autoScroll: 0,
      edgeResistance: 0.75,
      dragResistance: .2,
      minDuration: .4,
      maxDuration: .8,
      snap: { y: points },
      onThrowUpdate: function(){
        let vy = 50 - (this.y / 40)
        TweenMax.to(".Si", .6, {
          backgroundPositionY: `${vy}%`,
          '-webkit-background-position-y': `${vy}%`
        })
      }
    })