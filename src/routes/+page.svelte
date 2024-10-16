<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Todo from "$lib/components/Todo.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { superForm } from "sveltekit-superforms";

  const { data } = $props();
  const { createForm, updateForm, deleteForm } = data.forms;

  const { form, errors, message, enhance } = superForm(createForm, {
    onUpdated() {
      invalidate("app:todos");
    },
  });
</script>

<main class="flex flex-col items-center mt-[20vh]">
  <section class="flex flex-col gap-4 items-center text-center max-w-lg">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">DO... WUT AGAIN?</h1>
      <p>{"Another todo app to take Svelte 5 out for a spin :)"}</p>
    </div>
    <div class="w-full flex flex-col gap-4">
      <form
        method="post"
        action="?/create"
        class="flex rounded-lg shadow-hard"
        use:enhance
      >
        <Input
          type="text"
          name="description"
          placeholder="Do what?"
          bind:value={$form.description}
          class="rounded-r-none"
          aria-invalid={$errors.description ? "true" : undefined}
        />
        <Button
          variant="outline"
          type="submit"
          class="rounded-l-none border-l-0"
        >
          Add
        </Button>
      </form>
      {#if $errors.description}
        <span class="text-destructive text-sm">{$errors.description}</span>
      {/if}
      {#if $message}<span class="text-sm">{$message}</span>{/if}
    </div>
    {#if data.todos.length}
      <div
        class="w-full mt-4 flex flex-col border shadow-hard divide-y rounded-lg"
      >
        {#each data.todos as todo (todo.id)}
          <Todo {todo} {updateForm} {deleteForm} />
        {/each}
      </div>
    {/if}
  </section>
</main>
