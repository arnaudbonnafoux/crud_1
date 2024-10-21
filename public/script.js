document.getElementById('auteurForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;

    const response = await fetch('/auteurs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, email }),
    });

    if (response.ok) {
        document.getElementById('nom').value = '';
        document.getElementById('email').value = '';
        afficherAuteurs(); // Appel pour mettre à jour la liste des auteurs
    }
});

// Fonction pour afficher les auteurs
async function afficherAuteurs() {
    const response = await fetch('/auteurs');
    const auteurs = await response.json();
    const auteurList = document.getElementById('auteurList');
    auteurList.innerHTML = '';

    auteurs.forEach(auteur => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3'; // Chaque carte occupera 4 colonnes sur 12
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${auteur.nom}</h5>
                <p class="card-text">${auteur.email}</p>
                <button class="btn btn-info" onclick="remplirFormulaire(${auteur.id}, '${auteur.nom}', '${auteur.email}')">Modifier</button>
                <button class="btn btn-danger" onclick="supprimerAuteur(${auteur.id})">Supprimer</button>
            </div>
        `;
        
        col.appendChild(card);
        auteurList.appendChild(col);
    });
}

// Fonction pour supprimer un auteur
async function supprimerAuteur(id) {
    const response = await fetch(`/auteurs/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        afficherAuteurs(); // Met à jour la liste après suppression
    }
}

// Fonction pour remplir le formulaire de mise à jour
function remplirFormulaire(id, nom, email) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateNom').value = nom;
    document.getElementById('updateEmail').value = email;
    document.getElementById('updateForm').style.display = 'block'; // Afficher le formulaire de mise à jour
}

// Gérer la soumission du formulaire de mise à jour
document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('updateId').value;
    const nom = document.getElementById('updateNom').value;
    const email = document.getElementById('updateEmail').value;

    const response = await fetch(`/auteurs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, email }),
    });

    if (response.ok) {
        document.getElementById('updateForm').reset(); // Réinitialiser le formulaire
        document.getElementById('updateForm').style.display = 'none'; // Cacher le formulaire
        afficherAuteurs(); // Met à jour la liste après mise à jour
    }
});

// Appel pour afficher les auteurs lors du chargement
afficherAuteurs();
