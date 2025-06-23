# Layer Management System: Architectural Plan

This plan details the data model, interaction logic, and visual feedback for the canvas-based layer management system.

## 1. Core Data Structure

To maintain hierarchical integrity and manage stacking order, we'll use a tree data structure. The entire canvas can be represented as a root node, and every element (including containers) will be a node in this tree.

An individual element node will have the following structure:

```typescript
interface CanvasElement {
  id: string; // Unique identifier
  parentId: string | null; // ID of the parent element, or null for the root
  type: 'container' | 'image' | 'text'; // Type of the element
  props: {
    x: number; // Position relative to parent
    y: number;
    width: number;
    height: number;
    // z-index is implicit via array order
  };
  children: CanvasElement[]; // Array of child elements
}
```

**Key Concepts:**

- **Hierarchy:** The `parentId` and `children` properties define the parent-child relationships.
- **Contextual Stacking:** The stacking order for siblings is determined by their order in the `children` array of their common parent. The last element in the array is considered the "topmost" among its siblings. This directly implements the **Primacy of Recent Action** principle.

## 2. Interaction Logic & State Changes

Here’s how the data structure will be manipulated for each user action.

### A. Adding a New Element

- **Action:** A user drags a resource and drops it onto a container (`TargetContainer`).
- **Logic:**

  1.  Create a new `CanvasElement` object for the resource.
  2.  Set its `parentId` to `TargetContainer.id`.
  3.  Append the new element to the `TargetContainer.children` array. This automatically places it on top of its new siblings.

- **Hierarchy Change:**
  ```mermaid
  graph TD
      subgraph Before
          A[TargetContainer]
          A --> C1[Child 1]
          A --> C2[Child 2]
      end
      subgraph After
          A_After[TargetContainer]
          A_After --> C1_After[Child 1]
          A_After --> C2_After[Child 2]
          A_After --> N[New Element]
      end
  ```

### B. Nesting a Container (Container A into Container B)

- **Action:** User drags `Container A` and drops it onto `Container B`.
- **Logic:**

  1.  Find the original parent of `Container A` (`Parent A`).
  2.  Remove `Container A` from the `Parent A.children` array.
  3.  Update `Container A.parentId` to `Container B.id`.
  4.  Append `Container A` to the `Container B.children` array.
  5.  The internal `children` of `Container A` remain unchanged.

- **Hierarchy Change:**
  ```mermaid
  graph TD
      subgraph Before
          Root --> ParentA
          ParentA --> ContainerA
          ParentA --> SiblingOfA
          Root --> ContainerB
      end
      subgraph After
          Root_A[Root]
          Root_A --> ParentA_A[ParentA]
          ParentA_A --> SiblingOfA_A[SiblingOfA]
          Root_A --> ContainerB_A[ContainerB]
          ContainerB_A --> ContainerA_A[ContainerA]
      end
  ```

### C. Reparenting an Element

- **Action:** An element is dragged from `Parent A` to `Parent B`.
- **Logic:** This follows the same logic as nesting.
  1.  Remove the element from `Parent A.children`.
  2.  Update the element's `parentId` to `Parent B.id`.
  3.  Append the element to `Parent B.children`.

### D. Un-nesting an Element

- **Action:** A child element is dragged from a nested container to one of its ancestors (or the root canvas).
- **Logic:** This is a specific case of reparenting. The drop target is simply a container higher up in the hierarchy. The logic remains the same.

### E. Reordering Siblings

- **Action:** An element is dragged and dropped within the same container.
- **Logic:**
  1.  Identify the element and its parent container.
  2.  Remove the element from its current position in the `parent.children` array.
  3.  Append the element to the end of the `parent.children` array. This brings it to the front of the stacking order.

## 3. Visual Feedback and Edge Case Handling

A clear UI is critical for these interactions to feel intuitive.

- **Drag Operation:**

  - The original element remains in place but can be slightly faded out.
  - A "ghost" preview (e.g., with 50% opacity) follows the user's cursor.

- **Drop Targeting:**

  - As the user drags, continuously detect the element(s) under the cursor.
  - The potential parent container that would become the parent on drop must be clearly highlighted. An inset box-shadow or a distinct outline are good options.
  - **Ambiguous Drops:** If multiple containers overlap, the drop target is determined by:
    1.  Which container is topmost in its own stacking context.
    2.  Of those, which one has the smallest area.
        This ensures the most specific target is chosen. The highlight should only ever apply to one container at a time.

- **Invalid Operations:**
  - **Logic:** Before initiating a drop, perform a check: Is the intended drop target the same as the dragged element or one of its descendants? This can be done with a recursive search down the `children` of the dragged element.
  - **Feedback:** If the operation is invalid:
    1.  Do not show a drop target highlight.
    2.  Change the cursor to a "not-allowed" icon.
    3.  The ghost preview could optionally take on a red tint.
