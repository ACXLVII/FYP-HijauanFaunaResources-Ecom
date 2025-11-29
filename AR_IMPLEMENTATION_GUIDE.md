# AR Model Implementation Guide

## 📁 Step 1: Copy Your Model Files

You need to copy your 3D model files from `C:\Users\ainaz\OneDrive\Desktop\Grass model` to the project's `public/models` directory.

### Directory Structure Created:
```
public/
  models/
    live_grass/
    artificial_grass/
```

### File Mapping Guide:

#### **Live Grass Models** → `public/models/live_grass/`

Copy and rename your files as follows:

| Your File Name | Copy To | Rename To |
|---------------|---------|-----------|
| `Japanesegrass.glb` | `public/models/live_grass/` | `japanese.glb` |
| `Japanesegrass.usdz` | `public/models/live_grass/` | `japanese.usdz` |
| `Phillippinegrass.glb` | `public/models/live_grass/` | `philippine.glb` |
| `Phillippinegrass.usdz` | `public/models/live_grass/` | `philippine.usdz` |
| `PearlGrass.glb` | `public/models/live_grass/` | `pearl.glb` |
| `Pearlgrass.usdz` | `public/models/live_grass/` | `pearl.usdz` |
| `Cowgrass.glb` | `public/models/live_grass/` | `cow.glb` |
| `Cowgrass.usdz` | `public/models/live_grass/` | `cow.usdz` |

#### **Artificial Grass Models** → `public/models/artificial_grass/`

Copy and rename your files as follows:

| Your File Name | Copy To | Rename To |
|---------------|---------|-----------|
| `Fakegrass15mm.glb` | `public/models/artificial_grass/` | `15mm.glb` |
| `Fakegrass15mm.usdz` | `public/models/artificial_grass/` | `15mm.usdz` |
| `Fakegrass25mm.glb` | `public/models/artificial_grass/` | `25mm.glb` |
| `Fakegrass25mm.usdz` | `public/models/artificial_grass/` | `25mm.usdz` |
| `Fakegrass30mm.glb` | `public/models/artificial_grass/` | `30mm.glb` |
| `Fakegrass30mm.usdz` | `public/models/artificial_grass/` | `30mm.usdz` |
| `Fakegrass35mm.glb` | `public/models/artificial_grass/` | `35mm.glb` |
| `Fakegrass35mm.usdz` | `public/models/artificial_grass/` | `35mm.usdz` |
| `Fakegrass40mm.glb` | `public/models/artificial_grass/` | `40mm.glb` |
| `Fakegrass40mm.usdz` | `public/models/artificial_grass/` | `40mm.usdz` |

### Quick Copy Commands (PowerShell):

```powershell
# Navigate to your project root
cd "C:\Users\ainaz\Desktop\GitHub\FYP-HijauanFaunaResources-Ecom"

# Copy Live Grass Models
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Japanesegrass.glb" -Destination "public\models\live_grass\japanese.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Japanesegrass.usdz" -Destination "public\models\live_grass\japanese.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Phillippinegrass.glb" -Destination "public\models\live_grass\philippine.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Phillippinegrass.usdz" -Destination "public\models\live_grass\philippine.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\PearlGrass.glb" -Destination "public\models\live_grass\pearl.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Pearlgrass.usdz" -Destination "public\models\live_grass\pearl.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Cowgrass.glb" -Destination "public\models\live_grass\cow.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Cowgrass.usdz" -Destination "public\models\live_grass\cow.usdz"

# Copy Artificial Grass Models
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass15mm.glb" -Destination "public\models\artificial_grass\15mm.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass15mm.usdz" -Destination "public\models\artificial_grass\15mm.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass25mm.glb" -Destination "public\models\artificial_grass\25mm.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass25mm.usdz" -Destination "public\models\artificial_grass\25mm.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass30mm.glb" -Destination "public\models\artificial_grass\30mm.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass30mm.usdz" -Destination "public\models\artificial_grass\30mm.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass35mm.glb" -Destination "public\models\artificial_grass\35mm.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass35mm.usdz" -Destination "public\models\artificial_grass\35mm.usdz"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass40mm.glb" -Destination "public\models\artificial_grass\40mm.glb"
Copy-Item "C:\Users\ainaz\OneDrive\Desktop\Grass model\Fakegrass40mm.usdz" -Destination "public\models\artificial_grass\40mm.usdz"
```

## ✅ Step 2: Verify Files Are in Place

After copying, your directory structure should look like:

```
public/models/
  live_grass/
    japanese.glb
    japanese.usdz
    philippine.glb
    philippine.usdz
    pearl.glb
    pearl.usdz
    cow.glb
    cow.usdz
  artificial_grass/
    15mm.glb
    15mm.usdz
    25mm.glb
    25mm.usdz
    30mm.glb
    30mm.usdz
    35mm.glb
    35mm.usdz
    40mm.glb
    40mm.usdz
```

## 🎯 Step 3: Current AR Implementation Status

### ✅ Already Implemented:
1. **Live Grass Service Page** (`app/live_grass/components/sectionGrasses.js`)
   - All 4 grass types have AR buttons configured
   - Models are already referenced correctly

2. **Artificial Grass Grades Page** (`app/artificial_grass/components/sectionGrades.js`)
   - Premium and Economy grades have AR buttons
   - Currently uses generic `/models/artificial_grass/premium.glb` and `/models/artificial_grass/economy.glb`

### 🔧 Step 4: Next Steps for Full Implementation

#### Option A: Update Artificial Grass Grades to Use Thickness-Specific Models

You can update the grades page to show different models based on thickness, or create separate AR previews for each thickness option.

#### Option B: Add AR to Individual Product Pages

Add AR preview buttons to individual product pages in:
- `app/shop/artificial_grass/product/[slug]/components/sectionContent.js`
- `app/shop/live_grass/product/[slug]/components/sectionContent.js`

This would allow users to preview the exact product they're viewing in AR.

## 🧪 Step 5: Testing

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test on mobile device:**
   - AR features only work on mobile devices
   - Open the site on your phone
   - Navigate to Live Grass or Artificial Grass pages
   - Click the "AR Preview" button
   - Grant camera permissions when prompted

3. **Expected behavior:**
   - On iOS: Opens AR Quick Look
   - On Android: Opens Scene Viewer
   - On desktop: Button is hidden (AR only works on mobile)

## 📝 Notes

- **File sizes:** Large model files (like your 2.5MB+ .glb files) may take time to load. Consider optimizing if needed.
- **Model optimization:** If models are too large, consider using tools like `gltf-pipeline` to compress them.
- **Poster images:** The AR buttons use poster images as placeholders. Make sure the poster image paths are correct.

## 🚀 Ready to Go!

Once you've copied all the files, the existing AR implementation should work automatically. The code is already set up to use these model paths!

