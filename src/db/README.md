# Database consistency

To maintain consistency of databse, I added database functions & triggers, which manages consistency uppon inserting, updating and deleting transactions. This method greatly simplified server actions on backend side of application.

### Function to update budget on transaction insert
```
CREATE FUNCTION update_budget_on_transaction_insert()
  RETURNS TRIGGER AS $$
BEGIN
  -- Check if budget_uuid is set in the inserted transaction
  IF NEW.budget_uuid IS NOT NULL THEN
    -- Update the budget table based on the inserted transaction
    UPDATE budget
    SET spent = spent + NEW.amount
    WHERE uuid = NEW.budget_uuid;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Trigger to update budget on transaction insert
```
CREATE TRIGGER trigger_update_budget_on_transaction_insert
AFTER INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION update_budget_on_transaction_insert();
```

### Function to update budget on transaction delete
```
CREATE FUNCTION update_budget_on_transaction_delete()
  RETURNS TRIGGER AS $$
BEGIN
  -- Check if budget_uuid is set in the deleted transaction
  IF (OLD.budget_uuid IS NOT NULL) THEN
    -- Update the budget table based on the deleted transaction
    UPDATE budget
    SET spent = spent - OLD.amount
    WHERE uuid = OLD.budget_uuid;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
```

### Trigger to update budget on transaction delete
```
CREATE TRIGGER trigger_update_budget_on_transaction_delete
AFTER DELETE ON transaction
FOR EACH ROW
EXECUTE FUNCTION update_budget_on_transaction_delete();
```

### Function to update budget(s) on transaction update
```
CREATE OR REPLACE FUNCTION update_budget_on_transaction_update()
  RETURNS TRIGGER AS $$
DECLARE
  old_budget_uuid UUID;
  new_budget_uuid UUID;
  old_amount FLOAT;
  new_amount FLOAT;
BEGIN
  -- Capture the old and new budget_uuid values and amount from the update
  old_budget_uuid := OLD.budget_uuid;
  new_budget_uuid := NEW.budget_uuid;
  old_amount := OLD.amount;
  new_amount := NEW.amount;

  -- Check if budget_uuid is changed
  IF old_budget_uuid IS DISTINCT FROM new_budget_uuid OR old_amount IS DISTINCT FROM new_amount THEN
    -- Update the old budget's spent value
    IF old_budget_uuid IS NOT NULL THEN
      UPDATE budget
      SET spent = spent - old_amount::FLOAT
      WHERE uuid = old_budget_uuid;
    END IF;

    -- Update the new budget's spent value
    IF new_budget_uuid IS NOT NULL THEN
      UPDATE budget
      SET spent = spent + new_amount::FLOAT
      WHERE uuid = new_budget_uuid;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Trigger to update budget on transaction insert
```
CREATE TRIGGER trigger_update_budget_on_transaction_update
AFTER UPDATE ON transaction
FOR EACH ROW
EXECUTE FUNCTION update_budget_on_transaction_update();
```

### Function to update occurrenced this month in planned transaction table on transaction insert
```
CREATE FUNCTION update_occurrences_this_month()
  RETURNS TRIGGER AS $$
BEGIN
  UPDATE planned_transaction
  SET occurrences_this_month = occurrences_this_month + 1
  WHERE uuid = NEW.planned_transaction_uuid;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Trigger to update occurrenced this month in planned transaction table on transaction insert
```
CREATE TRIGGER trigger_update_occurrences_this_month
AFTER INSERT ON transaction
FOR EACH ROW
WHEN (NEW.planned_transaction_uuid IS NOT NULL)
EXECUTE FUNCTION update_occurrences_this_month();
```

### Function to update occurrenced this month in planned transaction table on transaction delete
```
CREATE FUNCTION decrease_occurrences_this_month()
  RETURNS TRIGGER AS $$
BEGIN
  UPDATE planned_transaction
  SET occurrences_this_month = occurrences_this_month - 1
  WHERE uuid = OLD.planned_transaction_uuid;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
```

### Trigger to update occurrenced this month in planned transaction table on transaction delete
```
CREATE TRIGGER trigger_decrease_occurrences_this_month
AFTER DELETE ON transaction
FOR EACH ROW
WHEN (OLD.planned_transaction_uuid IS NOT NULL)
EXECUTE FUNCTION decrease_occurrences_this_month();
```