new Vue({
  el: '#app',
  data:{
    newGame: true,
    you: '',
    monster: '',
    records: []
  },
  methods:{
    startNewGame: function(){
      this.newGame = !this.newGame;
      this.you = 100;
      this.monster = 100;
      this.records = [];
    },
    attack: function(){
      //damage è il danno che tu infliggi al mostro(potrebbe essere eliminata la variabile e tenuto solo il calcolo)
      var damage = this.calculateDamage(1,10)
      this.monster -= damage;
      // inserisco il log dell'attaco ai log, ho fattorizzato il turno dell'utente perchè si ripete più volte
      // se l'attacco è normale setto type così:
      var type = "normal attack";
      this.playerTurn(damage,type);
      //controllo per la vittoria dell'utente dopo il danno al mostro (il return serve per bloccare il codice che segue in caso di fine del gioco)
      if (this.checkWin()){
        return;
      }
      //calcolo dell'attacco del mostro, rifattorizzata perchè fa sempre lo stesso danno
      this.monsterAttack();
    },
    specialAttack: function(){
      //damage è il danno che tu infliggi al mostro(potrebbe essere eliminata la variabile e tenuto solo il calcolo) IN QUESTO CASO E' + ALTO PERCHE' E' UN ATTACCO SPECIALE
      var damage = this.calculateDamage(10,20)
      this.monster -= damage;
      //se l'ttacco è speciale setto type così:
      var type = "special attack !"
      this.playerTurn(damage, type);
      //controllo per la vittoria dell'utente dopo il danno al mostro (il return serve per bloccare il codice che segue in caso di fine del gioco)
      if (this.checkWin()){
        return;
      }
      //calcolo dell'attacco del mostro, rifattorizzata perchè fa sempre lo stesso danno
      this.monsterAttack();
    },
    heal: function(){
      //controllo a che punto è la vita quando curo per non superare i 100hp dell'utente e creare un bug
      var heal = 0;
      //se la vita dell'utente è sotto i 90 hp cura di 15, altrimenti se è superiore a 90 la vita torna a 100, chiaramente ogni volta segue un attacco del mostro (tra 5 e 12 danni) anche se si cura
      if (this.you <= 90){
        heal = 15;
        this.you += heal;
      }else{
        heal = 100 - this.you;
      }
      // aggiungo un log per la cura
      this.records.unshift({
        //setto il turno del player a turn perchè nell'html il la classe css dipende dai turni (riga 45-47)
        isPlayerTurn: true,
        text: "Player heals himself by "+heal+" HP"
      })
      //calcolo dell'attacco del mostro, rifattorizzata perchè fa sempre lo stesso danno
      this.monsterAttack();
    },
    calculateDamage: function(min,max){
      return Math.max(Math.floor(Math.random()*max) +1, min)
    },
    checkWin: function(){
      if(this.monster <= 0){
        if(confirm("You won! New Game?")){
          this.startNewGame();
        } else {
          this.newGame = false;
          this.monster = 0;
          this.records = [];
        }
        return true;
      }else if (this.you <= 0){
        if(confirm("You lost! New Game?")){
          this.startNewGame();
        } else {
          this.newGame = false;
          this.you = 0;
          this.records = [];
        }
        return true;
      }
      return false;
    },
    monsterAttack: function(){
      var damage = this.calculateDamage(5,12)
      //questa è la vita che perdi a causa del mostro, in questo caso non c'è la variabile damage
      this.you -= damage;
      // aggiungo il turno del mostro ai log
      this.records.unshift({
        //setto il turno del monster a turn perchè nell'html il la classe css dipende dai turni (riga 45-47)
        isPlayerTurn: false,
        text: "monster hits Player for " + damage+" HP"
      })
      //controllo per la vittoria del mostro dopo il danno all'utente (il return serve per bloccare il codice che segue in caso di fine del gioco)
      if (this.checkWin()){
        return;
      }
    },
    playerTurn: function(damage, type){
      //aggiungo un log ai record
      this.records.unshift({
        //setto il turno del player a turn perchè nell'html il la classe css dipende dai turni (riga 45-47)
        isPlayerTurn: true,
        text: "Player hits Monster for " + damage +" HP with a " + type
      })
    }
  },

});
