"use strict";

const buttons=[...document.querySelectorAll("#conditions button")],selected=new Set(),food=document.getElementById("food"),error=document.getElementById("error"),result=document.getElementById("result"),scoreEl=document.querySelector("#score b"),scoreBox=document.getElementById("score"),summary=document.getElementById("summary"),details=document.getElementById("details");
const names={diabetes:"Diabetes",hypertension:"High Blood Pressure",cholesterol:"High Cholesterol",gerd:"GERD / Acid Reflux",celiac:"Celiac Disease",ckd:"Chronic Kidney Disease",ibs:"IBS",gout:"Gout"};

const foodGroups={
"Fruit":["Apple","Banana","Blueberries","Orange","Strawberries","Grapes","Pear","Pineapple","Watermelon","Mango"],
"Vegetables":["Broccoli","Carrots","Spinach","Kale","Bell peppers","Cauliflower","Green beans","Sweet potato","Tomatoes","Zucchini"],
"Whole grains":["Oatmeal","Brown rice","Quinoa","Barley","Whole-wheat bread","Whole-grain pasta","Bulgur","Farro","Buckwheat","Whole-grain cereal"],
"Lean meat / poultry / fish":["Skinless chicken breast","Turkey breast","Salmon","Tuna","Cod","Tilapia","Shrimp","Lean pork loin","Lean beef sirloin","Canned sardines"],
"Processed meat":["Bacon","Sausage","Hot dogs","Pepperoni","Salami","Ham","Deli turkey","Deli roast beef","Corned beef","Beef jerky"],
"Dairy":["Low-fat milk","Greek yogurt","Plain yogurt","Cheddar cheese","Mozzarella cheese","Cottage cheese","Swiss cheese","Kefir","Ice cream","Cream cheese"],
"Beans / lentils":["Black beans","Kidney beans","Pinto beans","Chickpeas","Lentils","Navy beans","Cannellini beans","Split peas","Edamame","Black-eyed peas"],
"Nuts / seeds":["Almonds","Walnuts","Pistachios","Cashews","Peanuts","Pecans","Chia seeds","Flaxseeds","Pumpkin seeds","Sunflower seeds"],
"Sugary drinks":["Regular soda","Sweet tea","Fruit punch","Lemonade","Sports drink","Energy drink","Sweetened iced coffee","Flavored fruit drink","Chocolate milk","Sweetened bottled tea"],
"Desserts / candy":["Chocolate cake","Cheesecake","Apple pie","Ice cream sundae","Brownie","Chocolate chip cookies","Donuts","Gummy candy","Milk chocolate bar","Frosted cupcake"],
"Fried / fast food":["French fries","Fried chicken","Chicken nuggets","Cheeseburger","Fried fish sandwich","Onion rings","Mozzarella sticks","Fried shrimp","Breakfast sausage biscuit","Pepperoni pizza"],
"Spicy / acidic foods":["Hot sauce","Jalapeño peppers","Buffalo wings","Salsa","Tomato sauce","Orange juice","Grapefruit","Lemon juice","Vinegar-based pickles","Spicy curry"],
"Alcohol":["Beer","Red wine","White wine","Champagne","Hard cider","Margarita","Rum and cola","Whiskey","Vodka cocktail","Hard seltzer"]
};
const foods=Object.keys(foodGroups);

if(food){
  food.innerHTML='<option value="">Select a specific food</option>';
  Object.entries(foodGroups).forEach(([category,items])=>{
    const group=document.createElement("optgroup");group.label=category;
    items.forEach(item=>{const option=document.createElement("option");option.value=item;option.textContent=item;option.dataset.category=category;group.appendChild(option);});
    food.appendChild(group);
  });
}

const scores={
diabetes:[30,15,35,20,65,40,25,20,95,90,75,50,65],
hypertension:[15,15,25,30,85,35,20,20,70,65,85,35,70],
cholesterol:[15,10,20,25,80,45,15,15,65,75,90,40,60],
gerd:[45,30,30,30,65,55,45,55,65,65,90,90,85],
celiac:[5,5,70,20,55,25,10,10,20,85,90,30,60],
ckd:[45,40,40,55,90,65,55,60,70,60,90,45,65],
ibs:[45,40,45,20,55,50,70,35,65,65,80,70,70],
gout:[20,15,20,55,70,20,30,20,85,70,75,35,90]
};
const notes={
diabetes:"Carbohydrate content and food form can affect blood glucose; fiber-rich, minimally processed choices generally have a steadier effect than sugary drinks and refined foods.",
hypertension:"Sodium, saturated fat, added sugar and overall eating pattern matter. Fresh foods prepared with little added sodium are generally more favorable.",
cholesterol:"Fiber-rich foods and unsaturated fats can fit a heart-healthy pattern, while foods high in saturated fat and excess calories are generally less favorable.",
gerd:"Acidic, spicy, high-fat, caffeinated and alcoholic foods or drinks can trigger reflux symptoms in some people. Individual triggers vary.",
celiac:"The key issue is gluten. Wheat, barley and rye contain gluten; naturally gluten-free foods can still become unsafe through ingredients or cross-contact.",
ckd:"Sodium, potassium, phosphorus, protein and fluid needs can vary substantially with kidney function and laboratory results. Individual guidance is important.",
ibs:"IBS food tolerance is highly individual. FODMAP content, fiber, fat and portion size can affect symptoms such as bloating, pain or diarrhea.",
gout:"Purines, fructose-containing drinks and alcohol can affect uric acid and gout risk. Food choices and portions should be individualized."
};

buttons.forEach(b=>b.onclick=()=>{const c=b.dataset.c;if(selected.has(c)){selected.delete(c);b.classList.remove("selected")}else if(selected.size<4){selected.add(c);b.classList.add("selected")}else error.textContent="You can select a maximum of four conditions.";document.getElementById("count").textContent=`${selected.size} of 4 selected`;if(selected.size<4)error.textContent=""});

document.getElementById("submit").onclick=()=>{error.textContent="";if(!selected.size)return error.textContent="Please select at least one condition.";if(!food.value)return error.textContent="Please select a specific food.";const option=food.options[food.selectedIndex],category=option.dataset.category;if(!category||!foods.includes(category))return error.textContent="Please select a specific food from the list.";const fi=foods.indexOf(category),rows=[...selected].map(c=>({c,s:scores[c][fi]})),overall=Math.round(rows.reduce((a,x)=>a+x.s,0)/rows.length);scoreEl.textContent=overall;scoreBox.className="score "+(overall>50?"negative":overall<50?"positive":"neutral");summary.textContent=overall>50?"Overall, this food category has a more unfavorable estimated effect for the selected conditions. Scores over 50 are shown in red.":overall<50?"Overall, this food category has a more favorable estimated effect for the selected conditions. Scores under 50 are shown in green.":"The estimated overall effect is neutral or mixed. 50 is the midpoint.";details.innerHTML=`<article class="detail"><h3>Selected food</h3><span class="pill neutral">${option.textContent}</span><p>Category: ${category}</p></article>`+rows.map(r=>`<article class="detail"><h3>${names[r.c]}</h3><span class="pill ${r.s>50?"negative":r.s<50?"positive":"neutral"}">${r.s}/100</span><p>${notes[r.c]}</p></article>`).join("");result.classList.remove("hidden");result.scrollIntoView({behavior:"smooth"})};
