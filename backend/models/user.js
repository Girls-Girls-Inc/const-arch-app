class User {
    constructor(id, name, email, role, photoURL, signUpDate, profileComplete){
        this.id = id;
        this.name = name,
        this.email = email;
        this.isAdmin = role;
        this.photoURL = photoURL;
        this.signUpDate = signUpDate;
        this.profileComplete = profileComplete;
    }
}

export default User;