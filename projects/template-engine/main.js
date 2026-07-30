import { TemplateEngine } from "./utils";

// DEMO: Complete usage
function demoComplete() {
  const engine = new TemplateEngine();

  const template = `
<div class="user-card">
    <h2>{{name}}</h2>
    <p>Email: {{email}}</p>
    
    {{#if isAdmin}}
        <span class="badge admin">Admin</span>
    {{/if}}
    
    {{#if isActive}}
        <span class="badge active">Active</span>
    {{else}}
        <span class="badge inactive">Inactive</span>
    {{/if}}
    
    <h3>Hobbies:</h3>
    <ul>
    {{#each hobbies}}
        <li>{{this}}</li>
    {{/each}}
    </ul>
    
    <p>Address: {{address.city}}, {{address.country}}</p>
</div>`;

  // Show what's happening under the hood
  engine.showGeneratedCode(template);

  // Compile once
  const render = engine.compile(template);

  // Use many times with different data
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      isAdmin: true,
      isActive: true,
      hobbies: ["Coding", "Reading", "Gaming"],
      address: { city: "New York", country: "USA" },
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      isAdmin: false,
      isActive: false,
      hobbies: ["Design", "Photography"],
      address: { city: "London", country: "UK" },
    },
  ];

  console.log("\nRENDERED OUTPUT:");
  users.forEach((user, i) => {
    console.log(`\n--- User ${i + 1} ---`);
    console.log(render(user));
  });
}

demoComplete();
