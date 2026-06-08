let ans = document.querySelector('#res');
let btn = document.querySelector('button');

btn.addEventListener('click',function()  {

    let weight = Number(document.getElementById("wt").value);
    let wt_unit = document.getElementById("wt-unit").value;

    if(wt_unit === "lbs"){
        weight = weight * 0.453592;
    }



    let height = document.querySelector('#ht').value;
    let ht_unit = document.querySelector("#ht-unit").value;
    


    if(ht_unit === 'cm'){
        height = height / 100;
    }
    else if(ht_unit === 'ft/in'){
        let arr = height.split("'");

        let feet = Number(arr[0]);
        let inches = Number(arr[1]);

        height = (feet * 0.3048) + (inches * 0.0254);
    }







    if(weight == "" || height == ""){
        ans.innerHTML = "Please enter both values";
        return ;
    }
    else if(height <= 0){
        ans.innerHTML = "Invalid height";
        return ;
    }
    // BMI
    let bmi = weight / (Math.pow(height,2)) ; 
    if(bmi < 18.5)
    {
        ans.innerHTML = "You are UnderWeight." ;
    }
    else if(bmi >= 18.5 && bmi < 25)
    {
        ans.innerHTML = "You are Healthy." ;
    }
    else
    {
        ans.innerHTML = "You are OverWeight." ;
    }
});


