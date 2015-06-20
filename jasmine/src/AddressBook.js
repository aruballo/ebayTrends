function AddressBook(){
    var self = this;
    self.contacts = [];
    self.initialComplete = false;
    
    self.addContact = function(contact){
       self.contacts.push(contact) 
    };
    
    self.getContact = function(index){
        return self.contacts[index];
    };
    
    self.deleteContact = function(index){
        self.contacts.splice(index, 1);
    };
    
    self.getInitialContacts = function(cb){
        setTimeout(function(){
            self.initialComplete = true;
            if(cb){
                return cb();
            }
        }, 3);
    };
};