<template>
    <svg class="path" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="-10 -10 120 120">
        <path ref="path" v-bind:d="d" fill="transparent" stroke="black"/>
        <line v-for="(point, index) in endpoints"
            v-bind:x1="point.x"
            v-bind:y1="point.y"
            v-bind:x2="point.x - 5 * checkParity(index)"
            v-bind:y2="point.y"
            v-bind:data-id="index"
            v-on:click="$emit('clickEndpoint', $event.target.dataset.id)"
            stroke="black"
            stroke-width="2"
        />
        <slot></slot>
    </svg>
</template>

<script>
export default {
    data: function()
    {
        return {
            d: '',
            endpoints: [],
        }
    },
    methods:
    {
        // Compute the path d attribute based on datas. Return an array of endpoints constituting the path.
        createPath: function(data, slope)
        {
            let sum = data.reduce((a, e) => {return a + e.duration}, 0);
            this.endpoints = data.map((e) => {return e.duration/sum*100});
            this.clampAndBalance(this.endpoints, 10, 30);

            // Array of coordinates relative to previous point coordinates.
            this.endpoints.forEach((y, i, a)=>{
                let newSlope = (i === 0 || i === a.length - 1) ? slope/2 : slope;
                let x = y * slope;
                x *= this.checkParity(i);
                a[i] = {
                    x : x,
                    y: y
                }
            });
            this.endpoints.unshift({x:0, y:0});

            // Array of absolute coordinates
            this.endpoints.forEach(function(coord, i, a){
                if(i === 0){return;}

                a[i] = {
                    x : a[i-1].x + a[i].x,
                    y: a[i-1].y + a[i].y
                }
            });

            // Drawing the path
            this.endpoints.forEach( (coord, i) => {
                this.d += (i === 0) ? 'M 0 0' : ` L ${coord.x} ${coord.y}`;
            });

            return {
                path: this.$refs.path,
                endpoints: this.endpoints
            };
        },

        // Clamp all values in array and share the extra or the lack with all the other values.
        clampAndBalance: function(arr, min, max)
        {
            // isClamped array keep an eye on which values was clamped, so they can't be altered after that.
            let isClamped = new Array(arr.length);
            isClamped.fill(false);
            for(let k in isClamped)
            {
                if(arr[k] == min || arr[k] == max)
                {
                    isClamped[k] = true;
                }
            }

            // balanced controls the while loop.
            let balanced = false;

            while(!balanced)
            {
                for(let i in arr)
                {
                    balanced = true;

                    if(isClamped[i] === true)
                    {
                        continue;
                    }

                    // If not clamped, clamping the value.
                    let val = Math.max(min, arr[i]);
                    val = Math.min(max, val);
                    let r = arr[i] - val;
                    arr[i] = val;

                    // If offset not equal to zero, the value was clamped.
                    if(r !== 0)
                    {
                        isClamped[i] = true;
                        balanced = false;
                        let elemNotClampedNb = arr.length - isClamped.filter(val => val === true).length;
                        r = r/elemNotClampedNb;
                        
                        // Sharing the offset between the non clamped values.
                        for(let j in arr)
                        {
                            if(isClamped[j] === true)
                            {
                                continue;
                            }
                            arr[j] = arr[j] + r;
                        }
                    }
                }
            }

            return arr;
        },
        checkParity: function(i)
        {
            return (i % 2 === 0) ? 1 : -1;
        }
    },
    mouted: function()
    {

    }
}
</script>