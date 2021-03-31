import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quizz-together-terminal';

  started = false
  constructor(private http: HttpClient){
    const url = window.location.href
    if(url.includes("attente")||url.includes("partie")||url.includes("endgame")) this.started = true;
    else this.started = false
  }

  connect(): void {
    let source = new EventSource('http://localhost:8080/stream/game/'+Code+ "/new_round");
    source.addEventListener('new_round', message => {
        window.location.href += "/partie/"+Code+"/"+Pseudo
    });
  }

  start(pseudo: any, code: any, startWindow: any) {
    //console.log(pseudo.value)
    //console.log(code.value)
    Pseudo = pseudo.value
    Code = code.value
    console.log(Code)
    this.connect()
    var props = document.getElementById("attente")
    if(props!=null) props.className = ""
    console.log("gergre")
    this.http.post<any>("http://localhost:8080/api/game/"+Code+"/add_player/"+Pseudo, '').subscribe(data => {
      Pseudo = data.id
    });
    
    startWindow.remove()
  }
}

export var Pseudo: string;
export var Code: string;