<template>
    <svg class="path" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="-10 -10 120 120">
        <path v-bind:d="d" fill="transparent" stroke="black" stroke-width="2"/>              
    </svg>
</template>

<script>
export default {
    data: function()
    {
        return {
            d: 'M 0 0'
        }
    },
    methods:
    {
        createPath: function(data, slope)
        {
            let sum = data.reduce((a, e) => {return a + e.duration}, 0);
            let endpoints = data.map((e) => {return e.duration/sum*100});
            this.clampAndBalance(endpoints, 10, 30);

            let dir = -1
            this.d = 'M 0 0';
            endpoints = endpoints.map((y, i) => {
                let x = y * slope;
                dir *= -1;
                x *= dir;
                return {
                    x : x,
                    y: y
                }
            });

            endpoints.forEach(e => {
                this.d += ` l ${e.x} ${e.y}`;
            });

            return endpoints;
        },
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
        }
    },
    mouted: function()
    {

    }
}
</script>