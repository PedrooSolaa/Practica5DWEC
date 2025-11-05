let pets = [
    {
        nombre: "Max",
        descripcion: "Golden Retriever adulto, amigable y entrenado",
        imagenURL: "https://media.istockphoto.com/id/513133900/es/foto/oro-retriever-sentado-en-frente-de-un-fondo-blanco.jpg?s=612x612&w=0&k=20&c=0lRWImB8Y4p6X6YGt06c6q8I3AqBgKD-OGQxjLCI5EY=",
        fecha_nacimiento: "2023-01-15",
        precio: 800,
        codigo: "DOG001"
    },
    {
        nombre: "Luna",
        descripcion: "Cachorro Golden Retriever, juguetón y cariñoso",
        imagenURL: "https://marketplace.canva.com/MAC7YeYCqvg/2/thumbnail_large-1/canva-cute-blond-golden-retriever-puppy-sitting-and-facing-the-camera-isolated-on-a-white-background-MAC7YeYCqvg.png",
        fecha_nacimiento: "2024-06-10",
        precio: 1200,
        codigo: "DOG002"
    },
    {
        nombre: "Rocky",
        descripcion: "Perro de tamaño mediano, ideal para familias",
        imagenURL: "https://img.freepik.com/psd-gratis/vista-lindo-perro-mascota-marron-blanco_23-2150179459.jpg?semt=ais_hybrid&w=740&q=80",
        fecha_nacimiento: "2023-08-20",
        precio: 600,
        codigo: "DOG003"
    },
    {
        nombre: "Lola",
        descripcion: "Pug adulto, tranquilo y cariñoso",
        imagenURL: "https://img.freepik.com/foto-gratis/perro-pug-aislado-sobre-fondo-blanco_2829-11416.jpg?semt=ais_hybrid&w=740&q=80",
        fecha_nacimiento: "2023-03-25",
        precio: 900,
        codigo: "PUG001"
    },
    {
        nombre: "Thor",
        descripcion: "Perro pequeño, perfecto para apartamentos",
        imagenURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV1RlrbxJfEqwRJACDSVzfUmCqSdrP8QUkYA&s",
        fecha_nacimiento: "2023-11-05",
        precio: 750,
        codigo: "DOG004"
    }
];


const validatePetCode = (code) => {
    const codePattern = /^[A-Z]{3}[0-9]{3}$/;
    return codePattern.test(code);
};

const validateImageUrl = (url) => {
    const imagePattern = /\.(jpg|jpeg|png|gif)$/i;
    return imagePattern.test(url);
};

const validateBirthDate = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate <= today;
};


const addPet = (pet) => {
    pets.push(pet);
    renderPets();
    savePetsToLocalStorage();
};

const updatePet = (index, updatedPet) => {
    pets[index] = updatedPet;
    renderPets();
    savePetsToLocalStorage();
};

const deletePet = (index) => {
    pets.splice(index, 1);
    renderPets();
    savePetsToLocalStorage();
};

// Persistencia de datos
const savePetsToLocalStorage = () => {
    localStorage.setItem('pets', JSON.stringify(pets));
};

const loadPetsFromLocalStorage = () => {
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
        pets = JSON.parse(storedPets);
        renderPets();
    }
};


const renderPets = () => {
    const petList = document.getElementById('petList');
    petList.innerHTML = '';

    pets.forEach((pet, index) => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
        petCard.innerHTML = `
            <img src="${pet.imagenURL}" alt="${pet.nombre}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
            <h3>${pet.nombre}</h3>
            <p>${pet.descripcion}</p>
            <p>Nacimiento: ${new Date(pet.fecha_nacimiento).toLocaleDateString()}</p>
            <p>Precio: ${pet.precio}€</p>
            <p>Código: ${pet.codigo}</p>
            <div class="pet-card-actions">
                <button class="btn btn-edit" onclick="editPet(${index})">Editar</button>
                <button class="btn btn-delete" onclick="deletePet(${index})">Eliminar</button>
            </div>
        `;
        
        petList.appendChild(petCard);
    });
};


const petForm = document.getElementById('petForm');
const editMode = { active: false, index: -1 };

const editPet = (index) => {
    const pet = pets[index];
    const form = document.getElementById('petForm');
    
    form.petName.value = pet.nombre;
    form.petDescription.value = pet.descripcion;
    form.petImage.value = pet.imagenURL;
    form.petBirthDate.value = pet.fecha_nacimiento;
    form.petPrice.value = pet.precio;
    form.petCode.value = pet.codigo;
    
    editMode.active = true;
    editMode.index = index;
    
    form.querySelector('button[type="submit"]').textContent = 'Actualizar Mascota';
};

petForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const code = petForm.petCode.value.toUpperCase();
    const imageUrl = petForm.petImage.value;
    const birthDate = petForm.petBirthDate.value;
    
    if (!validatePetCode(code)) {
        alert('El código debe tener 3 letras seguidas de 3 números (ej: DOG123)');
        return;
    }
    
    if (!validateImageUrl(imageUrl)) {
        alert('La URL de la imagen debe terminar en .jpg, .jpeg, .png o .gif');
        return;
    }
    
    if (!validateBirthDate(birthDate)) {
        alert('La fecha de nacimiento no puede ser futura');
        return;
    }
    
    const pet = {
        nombre: petForm.petName.value,
        descripcion: petForm.petDescription.value,
        imagenURL: imageUrl,
        fecha_nacimiento: birthDate,
        precio: parseFloat(petForm.petPrice.value),
        codigo: code
    };
    
    if (editMode.active) {
        updatePet(editMode.index, pet);
        editMode.active = false;
        editMode.index = -1;
        petForm.querySelector('button[type="submit"]').textContent = 'Agregar Mascota';
    } else {
       
        if (pets.some(p => p.codigo === code)) {
            alert('Ya existe una mascota con ese código');
            return;
        }
        addPet(pet);
    }
    
    petForm.reset();
});


document.addEventListener('DOMContentLoaded', () => {
    loadPetsFromLocalStorage();
    
    if (pets.length > 0) {
        renderPets();
    }
});
