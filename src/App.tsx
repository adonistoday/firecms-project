import { useCallback } from "react";

import { User as FirebaseUser  } from "firebase/auth";
import {
    Authenticator,
    buildCollection,
    buildProperty,
    FirebaseCMSApp
} from "firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// TODO: Replace with your config

const firebaseConfig = {
  apiKey: "AIzaSyDm6z01-F-JhvfhWZt0abyU5OchwyyYdMc",
  authDomain: "maiinn.firebaseapp.com",
  projectId: "maiinn",
  storageBucket: "maiinn.appspot.com",
  messagingSenderId: "72086465434",
  appId: "1:72086465434:web:203eef22bd420f80816823",
  measurementId: "G-JTL518XJMC",
};

const locales = {
    "en-US": "English (United States)",
    "es-ES": "Spanish (Spain)",
    "de-DE": "German"
};

type Product = {
    email: string;
    image: string;
    productDescription: string;
    productName: string;
    productPrice: string;
    // related_products: EntityReference[];
    // main_image: string;
    // tags: string[];
    // description: string;
    // categories: string[];
    // publisher: {
    //     name: string;
    //     external_id: string;
    // },
    // expires_on: Date
}

const localeCollection = buildCollection({
    path: "locale",
    customId: locales,
    name: "Locales",
    singularName: "Locales",
    properties: {
        name: {
            name: "Title",
            validation: { required: true },
            dataType: "string"
        },
        selectable: {
            name: "Selectable",
            description: "Is this locale selectable",
            dataType: "boolean"
        },
        video: {
            name: "Video",
            dataType: "string",
            validation: { required: false },
            storage: {
                storagePath: "videos",
                acceptedFiles: ["video/*"]
            }
        }
    }
});

const productsCollection = buildCollection<Product>({
    name: "Products",
    singularName: "Product",
    path: "product-list",
    permissions: () => ({
        edit: true,
        create: true,
        // we have created the roles object in the navigation builder
        delete: true
    }),
    subcollections: [
        localeCollection
    ],
    properties: {
        email: {
            name: "Business Email",
            validation: { required: true },
            dataType: "string"
        },
        productName: {
            name: "Name",
            validation: {
                required: true,
            //     requiredMessage: "You must set a price between 0 and 1000",
            //     min: 0,
            //     max: 1000
            },
            // description: "Price with range validation",
            dataType: "string"
        },
        productPrice: {
            name: "Price",
            validation: { required: true },
            dataType: "string",
            // description: "Should this product be visible in the website",
            // longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
            // enumValues: {
            //     private: "Private",
            //     public: "Public"
            // }
        },
        productDescription: {
            name: "Description",
            validation: { required: true },
            dataType: "string",
        },
        // published: ({ values }) => buildProperty({
        //     name: "Published",
        //     dataType: "boolean",
        //     columnWidth: 100,
        //     disabled: (
        //         values.status === "public"
        //             ? false
        //             : {
        //                 clearOnDisabled: true,
        //                 disabledMessage: "Status must be public in order to enable this the published flag"
        //             }
        //     )
        // }),
        // related_products: {
        //     dataType: "array",
        //     name: "Related products",
        //     description: "Reference to self",
        //     of: {
        //         dataType: "reference",
        //         path: "products"
        //     }
        // },
        image: buildProperty({ // The `buildProperty` method is a utility function used for type checking
            name: "Image",
            dataType: "string",
            storage: {
                storagePath: "images",
                acceptedFiles: ["images/*"]
            }
        }),
        // tags: {
        //     name: "Tags",
        //     description: "Example of generic array",
        //     validation: { required: true },
        //     dataType: "array",
        //     of: {
        //         dataType: "string"
        //     }
        // },
        // description: {
        //     name: "Description",
        //     description: "Not mandatory but it'd be awesome if you filled this up",
        //     longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
        //     dataType: "string",
        //     columnWidth: 300
        // },
        // categories: {
        //     name: "Categories",
        //     validation: { required: true },
        //     dataType: "array",
        //     of: {
        //         dataType: "string",
        //         enumValues: {
        //             electronics: "Electronics",
        //             books: "Books",
        //             furniture: "Furniture",
        //             clothing: "Clothing",
        //             food: "Food"
        //         }
        //     }
        // },
        // publisher: {
        //     name: "Publisher",
        //     description: "This is an example of a map property",
        //     dataType: "map",
        //     properties: {
        //         name: {
        //             name: "Name",
        //             dataType: "string"
        //         },
        //         external_id: {
        //             name: "External id",
        //             dataType: "string"
        //         }
        //     }
        // },
        // expires_on: {
        //     name: "Expires on",
        //     dataType: "date"
        // }
    }
});

type Business = {
    business_name: string;
    email: string;
    category_value: string;
    first_name: string;
    last_name:string;
    password:string;
    phone_value:string;
    address_value:string;
    monday_open:string;
    monday_close:string;
    tuesday_open:string;
    tuesday_close:string;
    wednesday_open:string;
    wednesday_close:string;
    thursday_open:string;
    thursday_close:string;
    friday_open:string;
    friday_close:string;
    saturday_open:string;
    saturday_close:string;
    sunday_open:string;
    sunday_close:string;
    // related_products: EntityReference[];
    // main_image: string;
    // tags: string[];
    // description: string;
    // categories: string[];
    // publisher: {
    //     name: string;
    //     external_id: string;
    // },
    // expires_on: Date
}
const businessesCollection = buildCollection<Business>({
    name: "Businesses",
    singularName: "Business",
    path: "business-list",
    permissions: () => ({
        edit: true,
        create: true,
        // we have created the roles object in the navigation builder
        delete: true
    }),
    subcollections: [
        localeCollection
    ],
    properties: {
        business_name: {
            name: "Business Name",
            validation: { required: true },
            dataType: "string"
        },
        email: {
            name: "Business Email",
            validation: { required: true },
            dataType: "string"
        },
        category_value: {
            name: "Business Type",
            validation: { required: true },
            dataType: "string"
        },
        address_value:{
            name:"Address",
            validation:{required:true},
            dataType:"string"
        },
        first_name:{
            name:"First Name",
            validation:{required:true},
            dataType:"string"
        },
        last_name:{
            name:"Last Name",
            validation:{required:true},
            dataType:"string"
        },
        password:{
            name:"Password",
            validation:{required:true},
            dataType:"string"
        },
        phone_value:{
            name:"Phone Number",
            validation:{required:true},
            dataType:"string"
        },
        monday_open:{
            name:"Monday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        monday_close:{
            name:"Monday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        tuesday_open:{
            name:"Tuesday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        tuesday_close:{
            name:"Tuesday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        wednesday_open:{
            name:"Wednesday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        wednesday_close:{
            name:"Wednesday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        thursday_open:{
            name:"Thursday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        thursday_close:{
            name:"Thursday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        friday_open:{
            name:"Friday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        friday_close:{
            name:"Friday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        saturday_open:{
            name:"Saturday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        saturday_close:{
            name:"Saturday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        sunday_open:{
            name:"Sunday Open Time",
            validation:{required:true},
            dataType:"string"
        },
        sunday_close:{
            name:"Sunday Close Time",
            validation:{required:true},
            dataType:"string"
        },
        // price: {
        //     name: "Price",
        //     validation: {
        //         required: true,
        //         requiredMessage: "You must set a price between 0 and 1000",
        //         min: 0,
        //         max: 1000
        //     },
        //     description: "Price with range validation",
        //     dataType: "number"
        // },
        // status: {
        //     name: "Status",
        //     validation: { required: true },
        //     dataType: "string",
        //     description: "Should this product be visible in the website",
        //     longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
        //     enumValues: {
        //         private: "Private",
        //         public: "Public"
        //     }
        // },
        // published: ({ values }) => buildProperty({
        //     name: "Published",
        //     dataType: "boolean",
        //     columnWidth: 100,
        //     disabled: (
        //         values.status === "public"
        //             ? false
        //             : {
        //                 clearOnDisabled: true,
        //                 disabledMessage: "Status must be public in order to enable this the published flag"
        //             }
        //     )
        // }),
        // related_products: {
        //     dataType: "array",
        //     name: "Related products",
        //     description: "Reference to self",
        //     of: {
        //         dataType: "reference",
        //         path: "products"
        //     }
        // },
        // main_image: buildProperty({ // The `buildProperty` method is a utility function used for type checking
        //     name: "Image",
        //     dataType: "string",
        //     storage: {
        //         storagePath: "images",
        //         acceptedFiles: ["image/*"]
        //     }
        // }),
        // tags: {
        //     name: "Tags",
        //     description: "Example of generic array",
        //     validation: { required: true },
        //     dataType: "array",
        //     of: {
        //         dataType: "string"
        //     }
        // },
        // description: {
        //     name: "Description",
        //     description: "Not mandatory but it'd be awesome if you filled this up",
        //     longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
        //     dataType: "string",
        //     columnWidth: 300
        // },
        // categories: {
        //     name: "Categories",
        //     validation: { required: true },
        //     dataType: "array",
        //     of: {
        //         dataType: "string",
        //         enumValues: {
        //             electronics: "Electronics",
        //             books: "Books",
        //             furniture: "Furniture",
        //             clothing: "Clothing",
        //             food: "Food"
        //         }
        //     }
        // },
        // publisher: {
        //     name: "Publisher",
        //     description: "This is an example of a map property",
        //     dataType: "map",
        //     properties: {
        //         name: {
        //             name: "Name",
        //             dataType: "string"
        //         },
        //         external_id: {
        //             name: "External id",
        //             dataType: "string"
        //         }
        //     }
        // },
        // expires_on: {
        //     name: "Expires on",
        //     dataType: "date"
        // }
    }
});

export default function App() {

    const myAuthenticator: Authenticator<FirebaseUser> = useCallback(async ({
                                                                    user,
                                                                    authController
                                                                }:{user: FirebaseUser | null;authController: any }) => {

        if (user?.email?.includes("flanders")) {
            throw Error("Stupid Flanders!");
        }

        console.log("Allowing access to", user?.email);
        // This is an example of retrieving async data related to the user
        // and storing it in the user extra field.
        const sampleUserRoles = await Promise.resolve(["admin"]);
        authController.setExtra(sampleUserRoles);

        return true;
    }, []);

    return <FirebaseCMSApp
        name={"Maiinn"}
        authentication={myAuthenticator}
        collections={[productsCollection, businessesCollection]}
        firebaseConfig={firebaseConfig}
    />;
}