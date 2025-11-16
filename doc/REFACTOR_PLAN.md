# Frontend Refactor Plan - Placar360

## Overview
Refactor the frontend to match the Luthien architecture pattern and implement a working Club CRUD following the new structure.

---

## Architecture Pattern Analysis

### Luthien Structure:
- **`src/entities/`** - Entity types, services, and schemas (data layer)
- **`src/modules/`** - Feature modules with pages and components
- **`src/utils/`** - Utility classes (DefaultService, etc.)
- **`src/interfaces/`** - Shared TypeScript interfaces
- **`src/pages/`** - Top-level pages (Auth, Error, etc.)
- **`packages/components/`** - Shared UI components library
- **`packages/tokens/`** - Design tokens (colors, spacing, etc.)
- Path aliases configured in `tsconfig.json` and `vite.config.ts`

### Key Patterns:
1. **Entity Service Pattern**: Each entity has a service extending `DefaultService`
2. **Module-based Pages**: Feature pages organized in modules
3. **Reusable Components**: Components in packages for consistency
4. **Type Safety**: Strong TypeScript interfaces and types

---

## Step-by-Step Implementation Plan

### Phase 1: Foundation Setup
**Goal**: Set up the basic infrastructure to support the new architecture

#### 1.1 Update TypeScript Configuration
- [ ] Update `tsconfig.json` with path aliases matching Luthien pattern:
  - `@/*` → `./src/*`
  - `@assets/*` → `./src/assets/*`
  - `@pages/*` → `./src/pages/*`
  - `@services/*` → `./src/services/*`
  - `@interfaces/*` → `./src/interfaces/*`
  - `@utils/*` → `./src/utils/*`
  - `@packages/components` → `../../packages/components/src`
- [ ] Configure module resolution to match Luthien (`module: "Node16"`)

#### 1.2 Update Vite Configuration
- [ ] Configure path aliases in `vite.config.ts` matching tsconfig paths
- [ ] Keep proxy configuration for API calls
- [ ] Optionally add React SWC plugin for faster builds

#### 1.3 Set up Packages Structure
- [ ] Copy/create `packages/components/` structure (reference from Luthien)
- [ ] Copy/create `packages/tokens/` structure (reference from Luthien)
- [ ] Update `package.json` to include workspace dependencies if using monorepo

#### 1.4 Update Dependencies
- [ ] Add missing dependencies from Luthien:
  - `react-hook-form` + `@hookform/resolvers` (for forms)
  - `zod` (for schema validation - already in backend)
  - `clsx` + `tailwind-merge` (for className utilities)
  - `date-fns` (for date formatting)
  - Additional UI libraries as needed
- [ ] Install Tailwind CSS if not already present (Luthien uses it)

---

### Phase 2: Core Infrastructure
**Goal**: Create the core utilities and interfaces needed for entities

#### 2.1 Create Interfaces
- [ ] Create `src/interfaces/` folder
- [ ] Create `src/interfaces/QueryArguments.ts` (copy from Luthien pattern)
- [ ] Create `src/interfaces/PaginationReturn.ts` (copy from Luthien pattern)
- [ ] Create `src/interfaces/ApiError.ts` (if needed)

#### 2.2 Create Utility Files
- [ ] Update `src/utils/api.ts` to match Luthien pattern (axios setup with interceptors)
- [ ] Create `src/utils/default.service.ts` - Copy and adapt from Luthien
  - Note: Backend uses string IDs, Luthien uses number IDs - adjust accordingly
- [ ] Create `src/utils/utils.ts` (barrel export file)
- [ ] Create helper utilities as needed (error handling, formatting, etc.)

#### 2.3 Update API Configuration
- [ ] Ensure API base URL is properly configured
- [ ] Ensure token storage key matches backend expectations
- [ ] Test API interceptors for auth

---

### Phase 3: Club Entity Implementation
**Goal**: Implement the Club entity following Luthien pattern

#### 3.1 Create Club Entity Types
- [ ] Create `src/entities/Club/` folder
- [ ] Create `src/entities/Club/Club.ts`:
  - Define `ClubRequest` interface (matches CreateClubDto)
  - Define `ClubResponse` interface (matches ClubResponseDto)
- [ ] Create `src/entities/Club/clubSchema.ts`:
  - Copy Zod schemas from backend (CreateClubSchema, UpdateClubSchema)
  - Export as needed for form validation

#### 3.2 Create Club Service
- [ ] Create `src/entities/Club/club.service.ts`:
  - Extend `DefaultService<ClubResponse, ClubRequest, ClubRequest>`
  - Set URL to `/clubs` (matching backend controller)
  - Export singleton instance: `export const clubService = new ClubService()`

#### 3.3 Adjust DefaultService for String IDs
- [ ] Modify `src/utils/default.service.ts`:
  - Change ID type from `number` to `string | number` (or generic)
  - Ensure all methods work with string IDs
  - Test with Club entity

---

### Phase 4: Club Module/Page Implementation
**Goal**: Create the Club CRUD page following Luthien module pattern

#### 4.1 Create Club Module Structure
- [ ] Create `src/modules/Clubs/` folder
- [ ] Create `src/modules/Clubs/pages/Club/` folder
- [ ] Create `src/modules/Clubs/pages/Club/components/` folder

#### 4.2 Create Club Components
- [ ] Create `ClubList.tsx`:
  - Table component showing clubs
  - Uses components from `@packages/components`
  - Handles edit/delete actions
- [ ] Create `ClubForm.tsx`:
  - Form component for create/edit
  - Uses `react-hook-form` with Zod validation
  - Uses Club schemas from entity
- [ ] Create `ClubHeader.tsx` (optional):
  - Page header with title and actions

#### 4.3 Create Club Page
- [ ] Create `src/modules/Clubs/pages/Club/ClubPage.tsx`:
  - Main page component
  - Manages state (loading, error, clubs list)
  - Handles CRUD operations using `clubService`
  - Handles routing (list/create/edit modes)
- [ ] Create `src/modules/Clubs/pages/Club/ClubRoutes.tsx` (optional):
  - Route definitions for Club module

#### 4.4 Integrate Club Module
- [ ] Update `src/App.tsx` or routing file:
  - Add route for Club module
  - Ensure protected routes work
- [ ] Test navigation between list/create/edit views

---

### Phase 5: Integration & Testing
**Goal**: Ensure everything works together

#### 5.1 Component Integration
- [ ] Ensure `@packages/components` imports work correctly
- [ ] Replace old UI components with package components where applicable
- [ ] Test form validation with Zod schemas
- [ ] Test API calls with clubService

#### 5.2 Error Handling
- [ ] Implement proper error handling in Club page
- [ ] Show user-friendly error messages
- [ ] Handle loading states properly

#### 5.3 Testing Club CRUD
- [ ] Test Create: Create a new club
- [ ] Test Read: List all clubs, view single club
- [ ] Test Update: Edit existing club
- [ ] Test Delete: Delete a club
- [ ] Test validation: Invalid data handling

---

### Phase 6: Cleanup & Migration
**Goal**: Clean up old code and migrate remaining features

#### 6.1 Remove Old Club Code
- [ ] Remove old `src/pages/Clubs.tsx` (or refactor it)
- [ ] Remove old `src/components/ClubCard.tsx` (or migrate to new pattern)
- [ ] Remove old `src/components/ClubForm.tsx` (replaced by module component)
- [ ] Update any references to old Club components

#### 6.2 Migrate Other Entities (Future)
- [ ] Document pattern for migrating other entities (Court, Booking, etc.)
- [ ] Plan migration of other features following same pattern

---

## Implementation Notes

### Important Considerations:

1. **ID Type Mismatch**: 
   - Backend uses `string` IDs (UUID)
   - Luthien uses `number` IDs
   - **Solution**: Modify DefaultService to support both or use `string`

2. **API Endpoint Differences**:
   - Luthien: `/durin/users` format
   - Placar360: `/clubs` format
   - **Solution**: Use correct endpoint in service constructor

3. **Pagination**:
   - Backend may use different pagination format
   - **Solution**: Verify backend response format matches `PaginationReturn<T>`

4. **Components Library**:
   - If packages/components is not fully set up, use existing UI components initially
   - Gradually migrate to package components

5. **Styling**:
   - Luthien uses Tailwind CSS
   - Current frontend uses inline styles
   - **Solution**: Gradually migrate to Tailwind or keep inline styles for now

---

## Success Criteria

- [ ] Club entity service works correctly with backend API
- [ ] Club CRUD operations (Create, Read, Update, Delete) work end-to-end
- [ ] Code follows Luthien architecture pattern
- [ ] TypeScript types are properly defined and used
- [ ] No TypeScript errors
- [ ] Components are organized in module structure
- [ ] Old code is cleaned up or properly migrated

---

## Next Steps After Club CRUD

1. Migrate Court entity following same pattern
2. Migrate Booking entity following same pattern  
3. Migrate User entity if needed
4. Set up proper error boundaries
5. Add loading states and skeletons
6. Implement proper form validation feedback
7. Add unit tests for services
8. Add integration tests for CRUD flows

