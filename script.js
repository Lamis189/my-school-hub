const KEY="homework-helper-v2";

let d=JSON.parse(localStorage.getItem(KEY)||"null")||{
  name:"",
  subjects:["Math","English","Science"],
  hw:[],
  notes:[],
  dark:false
};

const $=id=>document.getElementById(id);

const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
}[c]));

function save(){
  localStorage.setItem(KEY,JSON.stringify(d));
  render();
}

function render(){
  document.body.classList.toggle("dark",d.dark);
  $("theme").textContent=d.dark?"☀️":"🌙";

  $("greeting").textContent=d.name
    ?`Hi, ${d.name}! Ready to learn?`
    :"Hi! Ready to learn?";

  $("open").textContent=d.hw.filter(x=>!x.done).length;
  $("done").textContent=d.hw.filter(x=>x.done).length;
  $("notesCount").textContent=d.notes.length;
  $("subCount").textContent=d.subjects.length;

  let opts=d.subjects
    .map(s=>`<option>${esc(s)}</option>`)
    .join("");

  $("hwSubject").innerHTML=opts;
  $("noteSubject").innerHTML=opts;

  $("subjects").innerHTML=d.subjects.map((s,i)=>
    `<span class="chip">${esc(s)}
      <button onclick="delSub(${i})">×</button>
    </span>`
  ).join("");

  let q=$("search").value.toLowerCase();
  let f=$("filter").value;

  let hw=d.hw.filter(x=>
    (f=="all"||(f=="done"?x.done:!x.done)) &&
    (x.title+" "+x.subject).toLowerCase().includes(q)
  );

  $("hwList").innerHTML=hw.length
    ?hw.map(x=>`
      <div class="item ${x.done?"done":""}">
        <div>
          <strong>${esc(x.title)}</strong>
          <div class="meta">
            ${esc(x.subject)} • ${esc(x.priority)} • ${x.due||"No due date"}
          </div>
        </div>
        <div>
          <button class="secondary" onclick="toggle(${x.id})">
            ${x.done?"↩ Open":"✓ Done"}
          </button>
          <button class="secondary" onclick="delHW(${x.id})">🗑️</button>
        </div>
      </div>
    `).join("")
    :"<p class='muted'>No homework here yet 💕</p>";

  let nq=$("noteSearch").value.toLowerCase();

  let ns=d.notes.filter(n=>
    (n.title+" "+n.text+" "+n.subject)
    .toLowerCase()
    .includes(nq)
  );

  $("noteList").innerHTML=ns.length
    ?ns.map(n=>`
      <div class="item">
        <div>
          <strong>${esc(n.title)}</strong>
          <p>${esc(n.text)}</p>
          <div class="meta">${esc(n.subject)}</div>
        </div>
        <button class="secondary" onclick="delNote(${n.id})">🗑️</button>
      </div>
    `).join("")
    :"<p class='muted'>No notes yet 🌸</p>";

  let total=d.hw.length;
  let done=d.hw.filter(x=>x.done).length;
  let p=total?Math.round(done/total*100):0;

  $("pct").textContent=p+"%";
  $("bar").style.width=p+"%";

  $("message").textContent=total
    ?(p==100
      ?"Amazing! All homework finished! 🎉"
      :`${done} of ${total} assignments finished. Keep going! 💪`)
    :"Add homework to get started!";
}

$("name").onclick=()=>{
  let n=prompt("What should Homework Helper call you?",d.name);

  if(n!==null){
    d.name=n.trim();
    save();
  }
};

$("theme").onclick=()=>{
  d.dark=!d.dark;
  save();
};

$("hwForm").onsubmit=e=>{
  e.preventDefault();

  d.hw.push({
    id:Date.now(),
    title:$("hwTitle").value.trim(),
    subject:$("hwSubject").value,
    priority:$("priority").value,
    due:$("due").value,
    done:false
  });

  e.target.reset();
  save();
};

$("subForm").onsubmit=e=>{
  e.preventDefault();

  let s=$("subName").value.trim();

  if(s&&!d.subjects.includes(s)){
    d.subjects.push(s);
    e.target.reset();
    save();
  }
};

$("noteForm").onsubmit=e=>{
  e.preventDefault();

  d.notes.push({
    id:Date.now(),
    title:$("noteTitle").value.trim(),
    subject:$("noteSubject").value,
    text:$("noteText").value.trim()
  });

  e.target.reset();
  save();
};

$("search").oninput=render;
$("filter").onchange=render;
$("noteSearch").oninput=render;

window.toggle=id=>{
  let x=d.hw.find(x=>x.id==id);
  x.done=!x.done;
  save();
};

window.delHW=id=>{
  d.hw=d.hw.filter(x=>x.id!=id);
  save();
};

window.delNote=id=>{
  d.notes=d.notes.filter(x=>x.id!=id);
  save();
};

window.delSub=i=>{
  if(d.subjects.length>1){
    d.subjects.splice(i,1);
    save();
  }
};

document.querySelectorAll("[data-mode]").forEach(b=>{
  b.onclick=()=>{
    let q=$("helpInput").value.trim();

    if(!q){
      $("helpOutput").textContent="Type what you're stuck on first 💕";
      return;
    }

    let m=b.dataset.mode;

    if(m=="simple")
      $("helpOutput").textContent=
      `Let's make it simple:

Topic: ${q}

Start with the definition, then look at one example, then try one yourself. Focus on one small idea at a time. 💡`;

    if(m=="steps")
      $("helpOutput").textContent=
      `Break it into steps:

1. Read the question.
2. Write what you know.
3. Identify what it asks.
4. Choose the rule or idea you need.
5. Do one small step.
6. Check your answer.

Topic: ${q}`;

    if(m=="practice")
      $("helpOutput").textContent=
      `Practice time! ✍️

Explain ${q} in your own words.

Then make one example and solve it without looking at your notes.

Check your work afterward!`;
  };
});

$("clear").onclick=()=>{
  if(confirm("Clear all saved Homework Helper data?")){
    localStorage.removeItem(KEY);
    location.reload();
  }
};

render();
