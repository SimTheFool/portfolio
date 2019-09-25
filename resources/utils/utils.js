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
    }
}