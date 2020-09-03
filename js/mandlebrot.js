
const mandlebrot_canvas = document.getElementById('mandlebrot-canvas');
const mandlebrot_ctx = mandlebrot_canvas.getContext('2d');


/*
 * Key event to respond to pressing the enter key rather than clicking the button
 */
function initMandlebrotEvents()
{
    document.getElementById('mandlebrot-input').addEventListener('keyup', function (event) {
        if (event.keyCode == 13)
        {
            event.preventDefault();
            document.getElementById('mandlebrot-button').click();
        }
    });
}

initMandlebrotEvents();
plot(0);


/* 
 * Determines whether the point lies in the mandlebrot set
 * Big 'i' means darker color,
 * Small 'i' means lighter color
 */
function calculate(c, threshold, maxSteps, startNum)
{
    let z = math.complex(startNum);
    let i = 0;
    while (math.multiply(z, math.conj(z)) < threshold && i < maxSteps)
    {
        z = math.add(math.multiply(z, z), c);
        i++;
    }
    return i
}

/*
 * Plot each point of the mandlebrot set starting at z_0 = startNum
 */
function plot(startNum)
{
    if (!isNaN(startNum))
    {
        let img = mandlebrot_ctx.createImageData(mandlebrot_canvas.width, mandlebrot_canvas.height);
        let mapper = function (x,y) {
            let a = x / 100 - 4;
            let b = 2 - y / 100; 
            return math.complex(a, b);
        }
        for(let y=0; y<mandlebrot_canvas.height; y++)
        {
            for(let x=0; x<mandlebrot_canvas.width; x++)
            {
                color = calculate(mapper(x, y), 4, 25, startNum);
                img.data[y * 4 * mandlebrot_canvas.width + 4 * x] = .283072 * (255 - 10 * color);
                img.data[y * 4 * mandlebrot_canvas.width + 4 * x + 1] = .130895 * (255 - 10 * color);
                img.data[y * 4 * mandlebrot_canvas.width + 4 * x + 2] = .449241 * (255 -  10 * color);
                img.data[y * 4 * mandlebrot_canvas.width + 4 * x + 3] = 255;
            }
        }
        mandlebrot_ctx.putImageData(img, 0, 0);
    }
    else
    {
        alert('Invalid Input');
    }
}




