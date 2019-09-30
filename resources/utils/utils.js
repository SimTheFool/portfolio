export default{
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
     },

     userToInitialCoordSys: function(svg, point)
     {
        let vec2 = {...point};
        let rect = svg.getBoundingClientRect();

        vec2.x -= rect.left;
        vec2.y -= rect.top;

        let viewBox = svg.viewBox.baseVal;

        vec2.x *= viewBox.width / rect.width;
        vec2.y *= viewBox.height / rect.height;

        vec2.x += viewBox.x;
        vec2.y += viewBox.y;
        
        return vec2;
    },

    /*
    pathToArray: function(path)
    {
        let arr = [];
        let virtPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        virtPath.setAttribute('d', path);
        let segments = [...virtPath.pathSegList];
        console.log(segments);

        virtPath.setAttribute('d', '');

        for(let segment of segments)
        {
            let obj = {
                command: segment.pathSegTypeAsLetter, 
                rawX: segment.x,
                rawY: segment.y
            };

            virtPath.setAttribute('d', virtPath.getAttribute('d') + ` ${obj.command} ${obj.rawX} ${obj.rawY} `);
            let absCoord = virtPath.getPointAtLength(virtPath.getTotalLength());

            obj.absX = absCoord.x;
            obj.absY = absCoord.y;

            arr.push(obj);
        }

        return arr;
    },

    arrayToPath:function(arr)
    {
        let d = '';

        for(let segment of arr)
        {
            d += `${segment.command} ${segment.rawX} ${segment.rawY} `;
        }

        return d;
    },

    harmonizePath: function(path1, path2)
    {
        let segments1 = this.pathToArray(path1);
        let segments2 = this.pathToArray(path2);

        let bigPath;
        let littlePath;

        let done = false;
        while(!done)
        {
            // Defining which path will receive new segments.
            if(segments1.length === Math.max(segments1.length, segments2.length))
            {
                bigPath = segments1;
                littlePath = segments2;
            }
            else
            {
                bigPath = segments2;
                littlePath = segments1;
            }

            for(let k = 0; k < bigPath.length; k++)
            {
                let bigSeg = bigPath[k];
                let littleSeg = littlePath[k];

                // bigSeg and littleSeg are the same command, no need to step in.
                if(littleSeg !== undefined && bigSeg.command === littleSeg.command)
                {
                    continue;
                }

                // @TODO manage path closing command
                // @TODO manage c command
                // bigSeg and littleSeg are different command, let's add a new command to littlePath in a way that doesn't change how it looks.
                let newSeg = {
                    command: bigSeg.command,
                    rawX: (k !== 0) ? littlePath[k-1].absX : 0,
                    rawY: (k !== 0) ? littlePath[k-1].absY : 0,
                    absX: (k !== 0) ? littlePath[k-1].absX : 0,
                    absY: (k !== 0) ? littlePath[k-1].absY : 0
                };

                if(newSeg.command === newSeg.command.toLowerCase())
                {
                    newSeg.rawX =  0;
                    newSeg.rawY =  0;
                }

                littlePath.splice(k, 0, newSeg);
            }

            if(littlePath.length === bigPath.length)
            {
                done = true;
            }
        }

        return [this.arrayToPath(segments1), this.arrayToPath(segments2)];
    } */
}