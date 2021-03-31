import { Component, OnInit } from '@angular/core';
import { Pseudo, Code} from '../app.component';
import { interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-partie',
  templateUrl: './partie.component.html',
  styleUrls: ['./partie.component.css']
})
export class PartieComponent implements OnInit {

  pseudo = window.location.toString().split("/")[5]
  code = window.location.toString().split("/")[4]
  points = 0
  duree = 25
  timer : number | undefined;

  connect(): void {
    let source = new EventSource('http://localhost:8080/stream/game/'+this.code+ "/new_round");
    source.addEventListener('new_round', message => {
        this.newQuestion()
    });
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.start()
    this.connect()
  }

  answer(id: number, propositions: HTMLElement){
    id--
    var corsHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': 'null'
    });
    this.http.put<any>("http://localhost:8080/api/game/"+this.code+"/"+this.pseudo+"/"+id, "",{headers:corsHeaders}).subscribe(data => {

  });
    propositions.className += " disabled"
    
  }

  newQuestion()
  {
    var props = document.getElementById("propositions")
    if(props!=null) props.className = "propositions"
    
    console.log("tkt")
    this.http.get<any>("http://localhost:8080/api/game/"+this.code+"/"+this.pseudo).subscribe(data => {
      console.log(data)  
      this.points = data.points
  });
    this.start()
  }

  start(){
    const sub = interval(1000).subscribe(x => {
      this.duree--;
      if(this.duree == 5)
      {
        console.log("envoyer la réponse et bloquer les boutons")
        var props = document.getElementById("propositions")
        if(props!=null) props.className += " disabled"
      }
      if(this.duree<0) 
      {
        this.duree=25
        sub.unsubscribe()
      }
    });
  }
}
